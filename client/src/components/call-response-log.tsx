

import React from "react";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material";



const emails = ['username@gmail.com', 'user02@gmail.com'];
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}

function CallResponseLog(props: SimpleDialogProps) {
  
  const [logPairs, setLogPairs] = React.useState([
    {title: '1st Q&A Generation', type: "Q&A", call: 'Hello', response: 'Hi there!' },
    {title: '2nd Q&A Generation', type: "Q&A", call: 'Hello', response: 'Hi there!' },
    {title: '1st Distractor Generation', type: "Distractor", call: 'How are you?', response: 'I am fine, thank you!' },
  ])
  const { onClose, selectedValue, open, setSelectedValue } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const selectedPair = logPairs.find(pair => pair.title === selectedValue) || {title: 'error', type: 'error404', call: '', response: '' };
  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>{selectedValue==="" ? "Select call & response pair" : selectedPair.title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>      
      {selectedValue=="" ? (
        <>

        <List sx={{ pt: 0 }}>
          {logPairs.map((pair, index) => (
            <ListItem disableGutters key={index}>
              <ListItemButton onClick={() => setSelectedValue(pair.title)}>
                <ListItemText primary={pair.title} />
              </ListItemButton>
            </ListItem>
          ))}
       </List>
       </>
      ) : (
        <>
          <TextField
            data-cy="call-output"
            label='Call'
            value={selectedPair.call}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            rows={1}
            sx={{ margin: 2 }}
          />
          <TextField
            data-cy="response-output"
            label='Response'
            value={selectedPair.response}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            rows={1}
            sx={{ margin: 2 }}
          />
          <DialogActions>
            <Button onClick={() => setSelectedValue("")}>Back</Button>
          </DialogActions>
          </>

      )}
      
     
    </Dialog>
  );
}

export default CallResponseLog;
