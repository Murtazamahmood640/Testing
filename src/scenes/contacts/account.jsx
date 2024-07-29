import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Account = () => {
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [imageProfile, setImageProfile] = useState();
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    personalEmail: "",
    gender: "",
    phoneNumber: "",
    birthday: "",
    street: "",
    city: "",
    state: "",
    country: "",
    linkedinId: "",
    twitter: "",
    facebook: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    education: [{ degree: "", institution: "", year: "" }],
    experiences: [{ jobTitle: "", company: "", years: "" }]
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`https://murtazamahm007-abidipro.mdbgo.io/api/users/user/${userId}`)
      .then((response) => {
        const userData = response.data;
        setFormData({
          name: userData.name || "",
          personalEmail: userData.personalEmail || "",
          gender: userData.gender || "",
          phoneNumber: userData.phoneNumber || "",
          birthday: userData.birthday ? userData.birthday.slice(0, 10) : "",
          street: userData.street || "",
          city: userData.city || "",
          state: userData.state || "",
          country: userData.country || "",
          linkedinId: userData.linkedinId || "",
          twitter: userData.twitter || "",
          facebook: userData.facebook || "",
          emergencyContactName: userData.emergencyContactName || "",
          emergencyContactRelation: userData.emergencyContactRelation || "",
          emergencyContactPhone: userData.emergencyContactPhone || "",
          education: userData.education || [{ degree: "", institution: "", year: "" }],
          experiences: userData.experiences || [{ jobTitle: "", company: "", years: "" }]
        });
      })
      .catch((error) => console.error("Failed to fetch user details", error));
  }, []);

  const handleFileChange = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setImageProfile(URL.createObjectURL(files[0]));
      setIsImageChanged(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleClickOpen = (section) => {
    setCurrentSection(section);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      await axios.put("https://murtazamahm007-abidipro.mdbgo.io/api/users/updateAccount", { userId, ...formData });
      alert("Account updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update account", error);
      alert("Failed to update account");
    }
  };

  const handleSaveImage = async () => {
    const fileInput = document.getElementById("profile-picture-upload");
    const file = fileInput.files[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("email", localStorage.getItem("email"));
      formData.append("file", file);

      const response = await fetch("https://murtazamahm007-abidipro.mdbgo.io/api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      setIsImageChanged(false);
      alert("Profile image updated successfully");
    } catch (e) {
      console.log("Error Occurred: " + e.message);
    }
  };

  const renderFormSection = () => {
    switch (currentSection) {
      case "Basic Information":
        return (
          <>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date Of Birth"
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </>
        );
      case "Address":
        return (
          <>
            <TextField
              fullWidth
              label="Street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="State / Province"
              name="state"
              value={formData.state}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              margin="normal"
            />
          </>
        );
      case "Social":
        return (
          <>
            <TextField
              fullWidth
              label="LinkedIn"
              name="linkedinId"
              value={formData.linkedinId}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              margin="normal"
            />
          </>
        );
      case "Emergency Contact":
        return (
          <>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Emergency Contact Relation"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              margin="normal"
            />
          </>
        );
      case "Education":
        return (
          <>
            {formData.education.map((edu, index) => (
              <Box key={index} mb={2}>
                <TextField
                  fullWidth
                  label="Degree"
                  name="degree"
                  value={edu.degree}
                  onChange={(event) => handleChange(event, index)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Institution"
                  name="institution"
                  value={edu.institution}
                  onChange={(event) => handleChange(event, index)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  value={edu.year}
                  onChange={(event) => handleChange(event, index)}
                  margin="normal"
                />
              </Box>
            ))}
            <Button onClick={() => setFormData({ ...formData, education: [...formData.education, { degree: "", institution: "", year: "" }] })}>
              Add Education
            </Button>
          </>
        );
      case "Experience":
        return (
          <>
            {formData.experiences.map((exp, index) => (
              <Box key={index} mb={2}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={exp.jobTitle}
                  onChange={(event) => handleChange(event, index)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={exp.company}
                  onChange={(event) => handleChange(event, index)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Years"
                  name="years"
                  value={exp.years}
                  onChange={(event) => handleChange(event, index)}
                  margin="normal"
                />
              </Box>
            ))}
            <Button onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { jobTitle: "", company: "", years: "" }] })}>
              Add Experience
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Box p={2} textAlign="center">
              <Avatar
                alt="Profile Picture"
                src={imageProfile || "default-profile.jpg"}
                sx={{ width: 100, height: 100, margin: "0 auto" }}
              />
              <input
                type="file"
                id="profile-picture-upload"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                onClick={() => document.getElementById("profile-picture-upload").click()}
              >
                <CloudUploadIcon />
              </IconButton>
              {isImageChanged && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveImage}
                  startIcon={<CloudUploadIcon />}
                >
                  Save Image
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Basic Information</Typography>
              <IconButton onClick={() => handleClickOpen("Basic Information")}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box p={2}>
              <Typography>Name: {formData.name}</Typography>
              <Typography>Email: {formData.personalEmail}</Typography>
              <Typography>Gender: {formData.gender}</Typography>
              <Typography>Phone Number: {formData.phoneNumber}</Typography>
              <Typography>Birthday: {formData.birthday}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Address</Typography>
              <IconButton onClick={() => handleClickOpen("Address")}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box p={2}>
              <Typography>Street: {formData.street}</Typography>
              <Typography>City: {formData.city}</Typography>
              <Typography>State / Province: {formData.state}</Typography>
              <Typography>Country: {formData.country}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Social Media</Typography>
              <IconButton onClick={() => handleClickOpen("Social")}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box p={2}>
              <Typography>LinkedIn: {formData.linkedinId}</Typography>
              <Typography>Twitter: {formData.twitter}</Typography>
              <Typography>Facebook: {formData.facebook}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Emergency Contact</Typography>
              <IconButton onClick={() => handleClickOpen("Emergency Contact")}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box p={2}>
              <Typography>Name: {formData.emergencyContactName}</Typography>
              <Typography>Relation: {formData.emergencyContactRelation}</Typography>
              <Typography>Phone: {formData.emergencyContactPhone}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Education</Typography>
              <IconButton onClick={() => handleClickOpen("Education")}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box p={2}>
              {formData.education.map((edu, index) => (
                <Box key={index} mb={2}>
                  <Typography>Degree: {edu.degree}</Typography>
                  <Typography>Institution: {edu.institution}</Typography>
                  <Typography>Year: {edu.year}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Experience</Typography>
              <IconButton onClick={() => handleClickOpen("Experience")}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box p={2}>
              {formData.experiences.map((exp, index) => (
                <Box key={index} mb={2}>
                  <Typography>Job Title: {exp.jobTitle}</Typography>
                  <Typography>Company: {exp.company}</Typography>
                  <Typography>Years: {exp.years}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentSection}</DialogTitle>
        <DialogContent>
          {renderFormSection()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Account;
