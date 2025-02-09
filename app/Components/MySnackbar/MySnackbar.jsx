import React,{useImperativeHandle,Suspense,useState} from 'react'
import {Stack,Snackbar,Slide } from '@mui/material/';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
function TransitionLeft(props) {
    return <Slide {...props} direction="right" />;
  }
const MySnackbar = React.forwardRef((props, ref) => {
	const [data, setData] = useState({ message: "", variant: "success" });
	const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);
	
	useImperativeHandle(ref, (Transition) => ({
		handleSnack(a) {
			setData(a);
            setTransition(() => Transition);
			setOpen(!open);
		},
	}));

	return (
		<Suspense fallback={null}>
		<Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar  anchorOrigin={{ vertical:"top", horizontal:"center" }} TransitionComponent={TransitionLeft} open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity={data?.variant} sx={{ width: '100%' }}>
        {data?.message}
        </Alert>
      </Snackbar>
    </Stack>
		</Suspense>
	);
});

export default MySnackbar