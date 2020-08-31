import React from "react";
import { Container } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import WebMapView from "./webmapview";
import WebMapView2 from "./webmapviewtest";
import ListData from "./listdata.jsx";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { getOrganizationRequirements, updateDB, getRequirementName } from "../data/dynamics";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { DocusignRequest } from "./docusign";

const useStyles = (theme) => ({
  dataDisplay: {
    marginTop: theme.spacing(4),
    alignItems: "left",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    padding: 30,
    align: "left",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07), 0 16px 32px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.07)",
  },
});

class CompanyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: null,
      value: 0,
      showData: true,
      showReview: false,
      organizationRequirements: [],
      percentageFlagged: null,
      mapLayerToggles: {
        covidTravelRisks: false,
        covidCases: false,
        deforestation: false,
      },
    };
  }

  handleFlag = (e, index) => {
    console.log(e, index);
  };

  handleNote = (e, index) => {
    console.log(e, index);
  };

  componentWillMount() {
    // retrieve list or organization requirements
    getOrganizationRequirements(this.props.company.accountid).then((data) => {
      console.log(data.value);
      this.setState({
        organizationRequirements: data.value,
      }, () => {
        let flagged = 0;
        this.state.organizationRequirements.forEach(requirement => {
          if (requirement.new_requirement_flag) {
            flagged = flagged + 1;
          }
        })
        console.log(flagged);
        console.log(this.state.organizationRequirements.length);
        this.setState({
          percentageFlagged: `${Math.round(flagged / this.state.organizationRequirements.length * 10000) / 100}%`
        })
      });
    });

    // TODO: retrieve map data
    this.setState({
      mapData: null,
    });
  }

  handleChange = (e, newVal) => {
    this.setState({
      value: newVal,
    });
  };

  showData = () => {
    this.setState({
      showData: true,
      showReview: false,
    });
  };

  showReview = () => {
    this.setState({
      showData: false,
      showReview: true,
    });
  };

  handleCovidCasesToggle = () => {
    this.setState({
      mapLayerToggles: {
        ...this.state.mapLayerToggles,
        covidCases: !this.state.mapLayerToggles.covidCases,
      },
    });
  };

  handleCovidTravelToggle = () => {
    this.setState({
      mapLayerToggles: {
        ...this.state.mapLayerToggles,
        covidTravelRisks: !this.state.mapLayerToggles.covidTravelRisks,
      },
    });
  };
  handleDeforestationToggle = () => {
    this.setState({
      mapLayerToggles: {
        ...this.state.mapLayerToggles,
        deforestation: !this.state.mapLayerToggles.deforestation,
      },
    });
  };
  handleSaveOR = (e, index) => {
    this.state.organizationRequirements[index] = e;

    console.log(e);
    updateDB(e.new_organization_requirementid, e.new_requirement_flag, e.new_requirement_notes)

    this.forceUpdate();
  }

  calculatePercentage = () => {
    let flagged = 0;
    this.state.organizationRequirements.forEach(requirement => {
      if (requirement.new_requirement_flag) {
        flagged = flagged + 1;
      }
      console.log("hi")
      return `${Math.round(flagged / this.state.organizationRequirements.length * 10000) / 100}%`
    })
    this.forceUpdate();
  };

  buttonStyleData = () => {
    if (this.state.showData) {
      return ({ background: '#e3e3e', width: '100%' })
    }
    else if (this.state.showReview) {
      return ({ width: '100%' })
    }
  }

  buttonStyleReview = () => {
    if (this.state.showReview) {
      return ({ background: '#e3e3e', width: '100%' })
    }
    else if (this.state.showData) {
      return ({ width: '100%' })
    }
  }

  thisRequirementName = () => {
    let requirementName;
    getRequirementName(this.state.requirement._new_fsc_requirment_type_per_coc_scenario_value).then(data => {
      console.log(data.value[0].fsc_standard_title)
      requirementName = data.value[0].fsc_standard_title;
    })
    return requirementName;
  }

  render() {

    const { classes } = this.props;
    return (
      <>
        <Container component="main" maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button onClick={this.props.handleCompanyClose} style={{ background: '#e3e3e' }}>Back</Button>
              <div className={classes.dataDisplay}>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <Button onClick={this.showData} style={{
                      background: this.state.showData ? 'white' : '#e3e3e',
                      width: '100%'
                    }} key={this.state.showData}>
                      Data
                    </Button>
                  </Grid>
                  <Grid item xs>
                    <Button onClick={this.showReview} style={{
                      background: this.state.showReview ? 'white' : '#e3e3e',
                      width: '100%'
                    }} key={this.state.showReview}>
                      Review
                    </Button>
                  </Grid>
                </Grid>

                {this.state.showData ? (
                  <>
                    <h1>{this.props.company.name}</h1>
                    <h3>
                      FSC License Number: {this.props.company.fsc_licensenumber}
                    </h3>
                    {this.state.organizationRequirements &&
                      this.state.organizationRequirements.map(
                        (dataValue, index) => (
                          <ListData
                            data={dataValue}
                            // handleFlag={this.handleFlag}
                            // handleNote={this.handleNote}
                            handleSave={this.handleSaveOR}
                            index={index}
                          />
                        )
                      )}
                  </>
                ) : null}
                {this.state.showReview ? (
                  <>
                    <h1>Review</h1>
                    <h4>Percentage Flagged: {this.state.percentageFlagged}</h4>
                    <h2>Flags: </h2>
                    <ul>
                      {this.state.organizationRequirements.map(requirement => {
                        return requirement.new_requirement_flag ? (<>
                          <h4>{`${this.thisRequirementName}: ${requirement.new_requirement_notes}`}</h4>
                        </>) : (<></>)
                      })}
                    </ul>
                    <DocusignRequest />
                  </>
                ) : null}
              </div>
            </Grid>

            <Grid item xs={12}>
              <WebMapView
                data={this.state.mapData}
                id={this.props.company.accountid}
                layers={this.state.mapLayerToggles}
                key={this.state.mapLayerToggles}
              />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

export default withStyles(useStyles)(CompanyView);
