import React from 'react';
import { Dialog as MuiDialog, DialogActions, DialogContent, DialogTitle, Backdrop, CircularProgress } from '@mui/material';

export const Dialog = ({
    openDialog,
    widthDialog,
    styleDialog,
    title,
    styleTitle,
    content,
    styleContent,
    actions,
    styleActions,
    openLoadingOverlay
}) => {

    return (
        <>
            <MuiDialog
                sx={{ '& .MuiDialog-paper': styleDialog }}
                maxWidth={widthDialog}
                fullWidth
                open={openDialog}
            >
                {
                    title &&
                    <DialogTitle sx={styleTitle}>
                        {title}
                    </DialogTitle>
                }
                <DialogContent sx={styleContent}>
                    {content}
                </DialogContent>
                <DialogActions sx={styleActions}>
                    {actions}
                </DialogActions>
                {openLoadingOverlay && (
                    <Backdrop
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: (theme) => theme.zIndex.modal + 1,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                        open={true}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                )}
            </MuiDialog>
        </>
    )
}