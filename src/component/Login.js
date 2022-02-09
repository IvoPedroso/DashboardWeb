import { useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

export default function Login({ userMgr, setToken, setAccessToken }) {

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("Erro!!!")
    //const [messageTypeError, setMessageTypeError] = useState(true);
    const [loading, setLoading] = useState(false);

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Formato de email inválido').required('Obrigatório'),
        password: Yup.string().required('Obrigatório')
    });

    const onSubmit = async (values) => {
        setLoading(true);
        userMgr.loginUser(values.email, values.password, (resp) => {
            if (resp.success && resp.token) {
                setToken(resp.token);
                setMessage("Login com sucesso!");
                setLoading(false);
                return;
            }
            setMessage("Login Inválido!");
            //setMessageTypeError(true);
            setShowMessage(true);
            setLoading(false);
        });

        userMgr.getAccessToken(
            values.email,
            values.password,
            (resp) => {
                setAccessToken(resp)
            }
        );

    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: onSubmit
    });

    const useStyles = makeStyles((theme) => ({
        login: {
            '& .MuiTextField-root, & .MuiButton-root': {
                margin: theme.spacing(1),
                width: '35ch',
            },
            display: 'flex',
            flexWrap: 'wrap',

            width: '47ch',
            height: '40ch',
            '& > form': {
                margin: theme.spacing(4)
            },
            '& .MuiTypography-root': {
                margin: '2ch 0ch 0ch 2ch'
            },
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        },
        wrapper: {
            margin: theme.spacing(1),
            position: 'relative',
        },

        buttonProgress: {
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        }
    }));

    const classes = useStyles();

    return (
        <div>
            <Paper elevation={3} className={classes.login}>
                <Typography variant="h3" gutterBottom>
                    Autenticação:
                </Typography>
                <form onSubmit={formik.handleSubmit} >
                    <TextField
                        id='email'
                        name='email'
                        label='Email'
                        variant="outlined"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    <div className={classes.wrapper}>
                        <Button
                            variant="contained"
                            color="primary"
                            // className={buttonClassname}
                            disabled={loading}
                            type="submit"
                        >
                            Login
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </form>
            </Paper>
            <Snackbar
                open={showMessage}
                onClose={() => setShowMessage(false)}
                TransitionComponent={(props) => { return <Slide {...props} direction="down" /> }}
                key='Message SnackBar'
            >
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowMessage(false)} severity="error" >
                    {message}
                </MuiAlert>
            </Snackbar>

        </div>
    );

}