import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Flag } from "@material-ui/icons";
import { FlagOutlined } from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import { getRequirementName } from "../data/dynamics";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const ListData = (props) => {
  const [currentData, setCurrentData] = useState(props.data);
  const [requirementInfo, setRequirementInfo] = useState(null);
  const [cocInput, setCocInput] = useState("");

  useEffect(() => {
    setCurrentData(props.data);
    getRequirementName(
      currentData._new_fsc_requirment_type_per_coc_scenario_value
    ).then((data) => {
      setRequirementInfo(data.value[0]);
    });
    setCocInput(currentData.new_coc_input);
  }, [props.data]);

  const handleFlag = () => {

    setCurrentData({
      ...currentData,
      new_requirement_flag: !currentData.new_requirement_flag,
    });
    // props.handleFlag(currentData, props.index);
  };

  const handleNote = (e) => {
    setCurrentData({
      ...currentData,
      new_requirement_notes: e.target.value,
    });
    // props.handleNote(e.target.value,props.index);
  };

  const handleSave = (e) => {
    //console.log(props.data);
    props.handleSave(currentData, props.index);
  };

  return (
    <>
      <Paper
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fafafa",
          borderRadius: 5,
          padding: 20,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07), 0 16px 32px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.07)",
        }}
      >
        {currentData !== props.data ? (
          <h5 style={{ color: "red" }}>You have unsaved changes!</h5>
        ) : null}
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            {requirementInfo ? (
              <>
                <Typography style={{ fontSize: "1.8rem", fontStyle: "bold", marginBottom: 20, marginTop:20 }}>Standard Title: {requirementInfo.fsc_standard_title}</Typography>
                <Typography style={{ fontSize: "1.4rem", marginBottom: 20, marginTop:20 }}>Standard Code: {requirementInfo.fsc_standard_code}</Typography>
                <Typography style={{ fontSize: "0.9rem", marginBottom: 20, marginTop:20 }}>
                  Standard Description: {requirementInfo.fsc_standard_comments}
                </Typography>
                <Typography style={{ fontSize: "1.2rem",fontStyle: "bold", marginBottom: 20, marginTop:20 }}>Company Input: {cocInput}</Typography>
              </>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={12} sm={5}>
            <div style={{ paddingRight: 10, height: "100%", width: "100%"}}>
              <TextField
                multiline
                variant="outlined"
                label="Notes"
                value={currentData.new_requirement_notes}
                onChange={handleNote}
                style={{ paddingBottom: 10, width:"100%" }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={1}>
            <div style={{ paddingRight: 10, height: "100%", alignItems: "center" }}>
              <Button
                onClick={handleFlag}
                style={{ background: "#e3e3e3", align: "center"}}
              >
                {currentData.new_requirement_flag ? <Flag /> : <FlagOutlined />}
              </Button>
            </div>
          </Grid>
        </Grid>
        <Button
          onClick={handleSave}
          style={{ background: "#e3e3e3", width: "100%" }}
        >
          Save
        </Button>
      </Paper>
    </>
  );
};

export default ListData;
