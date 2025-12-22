import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { supabase } from "../../utils/supabase";
import { COLORS } from "../../constants/colors";

export default function DeletePropertyDialog({ open, onClose, onConfirm, propertyId }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email;
    if (!email) {
      setError("No user session");
      setLoading(false);
      return;
    }
    // Re-authenticate
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError("Incorrect password");
      setLoading(false);
      return;
    }
    setLoading(false);
    setPassword("");
    setError("");
    onConfirm(propertyId);
    onClose();
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}
      PaperProps={{
        style: {
          background: '#fff',
          borderRadius: 18,
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
          border: `1.5px solid #ffffffff`,
        }
      }}
    >
      <DialogTitle style={{ color: COLORS.JUNGLE_GREEN, fontWeight: 700, fontSize: "1.3rem" }}>Confirm Delete</DialogTitle>
      <DialogContent>
        <p style={{ color: "#1a3c34", fontWeight: 500, marginBottom: 12 }}>To delete this property, please enter your password to confirm.</p>
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          margin="dense"
          sx={{
            '& .MuiInputBase-root': {
              background: '#fff',
              borderRadius: '9px',
              border: `1.5px solid #e6e1d6`,
              fontSize: '1.07rem',
              color: '#1a3c34',
              boxShadow: '0 1px 4px 0 rgba(0,166,118,0.04)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            },
            '& .MuiInputBase-root.Mui-focused': {
              borderColor: `${COLORS.JUNGLE_GREEN} !important`,
              boxShadow: '0 2px 8px 0 rgba(0,166,118,0.10)',
            },
            '& label': {
              color: COLORS.JUNGLE_GREEN,
              fontWeight: 600,
              fontSize: '1.01rem',
            },
            '& label.Mui-focused': {
              color: `${COLORS.JUNGLE_GREEN} !important`,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e6e1d6',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: `${COLORS.JUNGLE_GREEN} !important`,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {error && <div style={{ color: COLORS.DARK_RED, marginTop: 8, fontWeight: 600 }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}
          sx={{
            background: '#fff',
            color: COLORS.JUNGLE_GREEN,
            borderRadius: '8px',
            fontWeight: 600,
            border: `1.5px solid ${COLORS.JUNGLE_GREEN}`,
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              background: '#fff',
              borderColor: COLORS.JUNGLE_GREEN,
            },
          }}
        >Cancel</Button>
        <Button onClick={handleDelete} disabled={loading || !password}
          sx={{
            background: COLORS.JUNGLE_GREEN,
            color: '#fff',
            borderRadius: '8px',
            fontWeight: 600,
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              background: '#00885a',
            },
          }}
        >{loading ? "Deleting..." : "Delete"}</Button>
      </DialogActions>
    </Dialog>
  );
}
