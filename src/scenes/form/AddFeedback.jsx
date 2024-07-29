import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sentiment from 'sentiment';
import { jsPDF } from 'jspdf';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Feedback = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [feedback, setFeedback] = useState('');
  const [subject, setSubject] = useState('Feedback for Graphics Team');
  const [otherSubject, setOtherSubject] = useState('');
  const [name, setName] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [sentimentScore, setSentimentScore] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
    const storedHistory = JSON.parse(localStorage.getItem('feedbackHistory')) || [];
    setFeedbackHistory(storedHistory);
  }, []);

  const analyzeSentiment = (text) => {
    const sentimentAnalyzer = new Sentiment();
    const result = sentimentAnalyzer.analyze(text);
    setSentimentScore(result.score);
    if (result.score > 0) return 'Positive';
    if (result.score < 0) return 'Negative';
    return 'Neutral';
  };

  const extractKeywords = (text) => {
    const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
    const words = text.toLowerCase().split(/\s+/).filter(word => !stopWords.includes(word));
    const wordCount = words.reduce((count, word) => {
      count[word] = (count[word] || 0) + 1;
      return count;
    }, {});
    return Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]).slice(0, 5);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Feedback History`, 10, 10);
    feedbackHistory.forEach((item, index) => {
      const yPos = 20 + index * 40;
      doc.text(`Feedback ${index + 1}:`, 10, yPos);
      doc.text(`Name: ${item.name}`, 20, yPos + 10);
      doc.text(`Feedback: ${item.feedback}`, 20, yPos + 20);
      doc.text(`Sentiment: ${item.sentiment} (Score: ${item.sentimentScore})`, 20, yPos + 30);
    });
    doc.save('feedback_history.pdf');
  };

  const handleSubmit = async (values) => {
    setErrorMessage('');

    const feedbackSentiment = analyzeSentiment(feedback);
    const feedbackKeywords = extractKeywords(feedback);
    setSentiment(feedbackSentiment);
    setKeywords(feedbackKeywords);

    const actualSubject = subject === 'Other' ? otherSubject : subject;
    console.log('Subject being sent:', actualSubject);

    const payload = {
      subject: actualSubject,
      feedback,
      name: values.name,
      sentiment: feedbackSentiment,
      sentimentScore,
      keywords: feedbackKeywords
    };

    console.log('Sending payload:', payload);

    try {
      const response = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/feedback', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Full response:', response);
      console.log('Feedback submitted:', response.data);
      alert('Feedback submitted successfully');

      const newFeedback = { ...payload };
      const updatedHistory = [...feedbackHistory, newFeedback];
      setFeedbackHistory(updatedHistory);
      localStorage.setItem('feedbackHistory', JSON.stringify(updatedHistory));

      setFeedback('');
      setSubject('Feedback for Graphics Team'); // Reset subject to default
      setOtherSubject(''); // Reset other subject
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        setErrorMessage(`Error ${error.response.status}: ${error.response.data}`);
      } else {
        console.error('Error:', error.message);
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="FEEDBACK" subtitle="Provide your valuable feedback" />
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={feedbackSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(12, 1fr)"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 12" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 6" }}
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }}>
                <InputLabel>Feedback Subject</InputLabel>
                <Select
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <MenuItem value="Feedback for Graphics Team">Feedback for Graphics Team</MenuItem>
                  <MenuItem value="Feedback for Developers Team">Feedback for Developers Team</MenuItem>
                  <MenuItem value="Feedback for Management">Feedback for Management</MenuItem>
                  <MenuItem value="Feedback for Employees">Feedback for Employees</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {subject === 'Other' && (
                  <TextField
                    type="text"
                    value={otherSubject}
                    onChange={(e) => setOtherSubject(e.target.value)}
                    placeholder="Please specify"
                    required
                    sx={{ marginTop: "10px" }}
                  />
                )}
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Feedback"
                onBlur={handleBlur}
                onChange={(e) => setFeedback(e.target.value)}
                value={feedback}
                name="feedback"
                error={!!touched.feedback && !!errors.feedback}
                helperText={touched.feedback && errors.feedback}
                sx={{ gridColumn: "span 12" }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Submit Feedback
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Button onClick={() => setShowHistory(!showHistory)} sx={{ mt: 2 }}>
        {showHistory ? 'Hide Feedback History' : 'Show Feedback History'}
      </Button>
      {showHistory && (
        <Box mt={2}>
          <ul>
            {feedbackHistory.map((item, index) => (
              <li key={index}>
                <p>Name: {item.name}</p>
                <p>Feedback: {item.feedback}</p>
                <p>Sentiment: {item.sentiment} (Score: {item.sentimentScore})</p>
                <p>Keywords: {item.keywords.join(', ')}</p>
              </li>
            ))}
          </ul>
          <Button onClick={generatePDF} variant="contained" color="secondary">
            Download Feedback History
          </Button>
        </Box>
      )}
    </Box>
  );
};

const initialValues = {
  name: '',
  feedback: '',
};

const feedbackSchema = yup.object().shape({
  name: yup.string().required('Required'),
  feedback: yup.string().required('Required'),
});

export default Feedback;
