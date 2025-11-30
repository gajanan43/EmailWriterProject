import { useState } from "react";
import { 
  Container, Typography, Box, TextField, FormControl, 
  InputLabel, Select, MenuItem, Button, CircularProgress 
} from "@mui/material";

import './App.css';

function App() {

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!emailContent.trim()) {
      setError("Please enter email content!");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, tone })
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setGeneratedReply(data.reply);  // backend must return { "reply": "..." }

    } catch (err) {
      setError("Failed to generate reply. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        
        {/* Email Content Input */}
        <TextField
          multiline
          fullWidth
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 3 }}
          required
        />

        {/* Tone Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select 
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Formal">Formal</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        {/* Generate Button */}
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Reply"}
        </Button>

        {/* Error */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* Generated Reply */}
        {generatedReply && generatedReply.trim() !== "" && (
          <Box sx={{ mt: 3 }}>
            
            <Typography 
              sx={{ 
                fontSize: "14px", 
                color: "rgba(0,0,0,0.6)", 
                mb: 1 
              }}
            >
              Generated Reply
            </Typography>

            <TextField
              multiline
              fullWidth
              rows={6}
              variant="outlined"
              value={generatedReply}
              InputProps={{ readOnly: true }}
            />

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              Copy to Clipboard
            </Button>

          </Box>
        )}


      </Box>
    </Container>
  );
}

export default App;
