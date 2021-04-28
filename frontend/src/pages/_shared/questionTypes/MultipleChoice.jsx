import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import EditIcon from '@material-ui/icons/Edit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FormLabel from '@material-ui/core/FormLabel';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const RemoveButton = ({ onClick }) => (
  <label htmlFor="icon-button-file">
    <IconButton
      color="primary"
      aria-label="upload picture"
      component="span"
      onClick={onClick}
    >
      <ClearRoundedIcon />
    </IconButton>
  </label>
);

const MultipleChoice = (props) => {
  const { id, instruction, data: originalData, save } = props;
  const classes = useStyles();
  const dataCopy = { ...originalData };
  const [data, setData] = useState(dataCopy);
  const [popoverText, setPopoverText] = useState('');
  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const addOption = () => {
    const newOption = { isCorrect: false, value: '' };
    const newOptions = [...data.options, newOption];
    const newData = { ...data, options: newOptions };
    setData(newData);
  };

  const removeOption = (optionToRemove) => {
    const newOptions = data.options.filter(
      (option) => option !== optionToRemove
    );
    const newData = { ...data, options: newOptions };
    setData(newData);
  };

  const editOption = (optionToEdit, event) => {
    const newOptions = data.options.map((option) => {
      if (option === optionToEdit) {
        return { ...option, value: event.target.value };
      }
      return option;
    });
    const newData = { ...data, options: newOptions };
    setData(newData);
  };

  const editCorrect = (newCorrectOption, event) => {
    const newOptions = data.options.map((option) => {
      if (option === newCorrectOption) {
        return { ...newCorrectOption, isCorrect: !option.isCorrect };
      }
      return option;
    });
    const newData = { ...data, options: newOptions };
    setData(newData);
  };

  const enableEdit = () => setEditing(true);

  const saveEdit = () => {
    setEditing(false);
    save(data);
  };

  const cancelEdit = () => {
    setEditing(false);
    setData(originalData);
  };

  const handlePopoverOpen = (event, message) => {
    setPopoverText(message);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>{popoverText}</Typography>
      </Popover>
      <ListItem alignItems="flex-start" key={id}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="body1" className={classes.marginBottom}>
              {instruction}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>{data.value}</Typography>
          </Grid>
          <Grid item xs={10}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Selecteer het juiste antwoord
              </FormLabel>
              <RadioGroup>
                {data.options.map((option, index) => (
                  <div>
                    <FormControlLabel
                      key={index}
                      value={option.value}
                      control={
                        <Radio
                          color="primary"
                          checked={option.isCorrect}
                          onClick={(event) => editCorrect(option, event)}
                        />
                      }
                      label={
                        editing ? (
                          <TextField
                            value={option.value}
                            onChange={(event) => editOption(option, event)}
                            placeholder="Nieuw antwoord"
                          />
                        ) : (
                          option.value
                        )
                      }
                      disabled={!editing}
                    />
                    {editing && (
                      <RemoveButton onClick={() => removeOption(option)} />
                    )}
                  </div>
                ))}
              </RadioGroup>
              {editing ? (
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={addOption}
                  >
                    <AddCircleIcon />
                  </IconButton>
                  Antwoord toevoegen
                </label>
              ) : null}
            </FormControl>
          </Grid>
          {editing ? (
            <>
              <Grid item xs={1}>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={saveEdit}
                  onMouseEnter={(e) =>
                    handlePopoverOpen(e, 'Aanpassingen opslaan')
                  }
                  onMouseLeave={handlePopoverClose}
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                >
                  <CheckCircleRoundedIcon />
                </IconButton>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  color="secondary"
                  component="span"
                  onClick={cancelEdit}
                  onMouseEnter={(e) =>
                    handlePopoverOpen(e, 'Aanpassingen ongedaan maken')
                  }
                  onMouseLeave={handlePopoverClose}
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                >
                  <CancelRoundedIcon />
                </IconButton>
              </Grid>
            </>
          ) : (
            <Grid item xs={2}>
              <IconButton
                color="primary"
                onClick={enableEdit}
                onMouseEnter={(e) => handlePopoverOpen(e, 'Vraag aanpassen')}
                onMouseLeave={handlePopoverClose}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
              >
                <EditIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </ListItem>
    </>
  );
};

export default MultipleChoice;
