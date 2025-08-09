"use client";
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Chip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DOMPurify from 'dompurify';
import Link from "next/link";

const PaperInfoModal = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#F3F4F6', color: '#1F2937', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {data.setTitle}
        <CloseIcon onClick={onClose} sx={{ cursor: 'pointer', color: '#1F2937' }} />
      </DialogTitle>
      <DialogContent>
        {data.fullDescription && (
          <div className="paper-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.fullDescription) }} style={{ padding: '16px' }} />
        )}

        {/* Selected papers list is unknown at list page; we can showcase included papers count and extras availability */}
        <div style={{ marginTop: 16 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Included Papers</Typography>
          <Typography variant="body2">Total: {data.papers?.length || 0}</Typography>
          {data.papers?.slice(0, 6).map((p, idx) => (
            <Chip key={idx} label={p.title} sx={{ mr: 1, mb: 1 }} />
          ))}
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ color: 'white', backgroundColor: '#EF4444', '&:hover': { backgroundColor: '#DC2626' }, flex: 1, mr: 1 }}>Close</Button>
        <Link href={`/paper/buy/${data._id}`} style={{ flex: 1 }}>
          <Button sx={{ color: 'white', backgroundColor: '#059669', '&:hover': { backgroundColor: '#047857' }, width: '100%' }}>Buy Papers</Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default PaperInfoModal;


