import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Input,
  InputLabel,
  Button,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const styles = theme => ({
  root: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: '25px auto',
    width: '500px',
    textAlign: 'center',
  },
  headline: {
    padding: theme.spacing(3),
  },
  textField: {
    margin: theme.spacing(3),
    width: '300px',
  },
  button: {
    margin: theme.spacing(3),
    marginTop: '50px',
    width: '300px',
  },
});

class Login extends Component {
  state = {
    showPassword: false,
  };

  handleMouseDownPassword = e => e.preventDefault();

  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });

  render() {
    const { showPassword } = this.state;
    const { email, password, onChange, onSubmit, classes } = this.props;

    return (
      <div>
        <Paper className={classes.root} elevation={5}>
          <Typography className={classes.headline} variant="h6" component="h3">
            Login to Verify Incidents
          </Typography>
          <Divider />
          <form className={classes.container} onSubmit={onSubmit}>
            <TextField
              id="email"
              name="email"
              label="Username/Email"
              value={email}
              onChange={onChange}
              className={classes.textField}
            />
            <FormControl className={classes.textField}>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="adornment-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={onChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Login
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

Login.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
