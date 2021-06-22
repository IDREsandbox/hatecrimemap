export const JOYRIDE_STEPS = [
        { 
          target: '#hateCrimeTutorial',
          content: 'Welcome to the Hate Crime Map tutorial. Follow the instructions and then hit "Next" to proceed',
          spotlightClicks: true,          
          disableOverlayClose: true,
          disableBeacon: true,
          hideCloseButton: true,
          placement: 'center',
        },
        {// 1
          target: '#USA',
          content: 'This is the map panel, hover over states to see their charts. Hover outside the United States to show all of the data again, then click "Next".',
          spotlightClicks: true,
        },
        {// 2
          target: '.leaflet-states-pane .leaflet-interactive:nth-child(4)',
          content: 'You can click on a state to lock/unlock it. Click on California to lock it and then click "Next"',
          spotlightClicks: true,
        },
        {// 3
          target: '.sideMenu__chart',
          content: 'Click on a bar in the chart to see details, and then click "Next".',
          spotlightClicks: true,
          disableBeacon: true,
        },
        {// 4
          target: '#hatecrimePieChart',
          content: 'Click on a pie chart slice to open the data table for that state, and then click "Next". ',
          spotlightClicks: true,
          disableBeacon: true,
          disableOverlay:true,
        },
        {// 5
          target: '#hateCrimeDataTable',
          content: 'This is the individual incident reports. Click "Close" to close the table and then click next.',
          disableOverlay:true,
          disableBeacon: true,
          spotlightClicks: true,
          placement: 'center',
        },
        {// 6
          disableBeacon: false,
          target: '#chartbackButton',
          spotlightClicks: true,
          disableOverlay:true,
          content: 'Click on the "Back" button return to the previous chart, then click "Next".',
        },      
        {// 7
          target: '.leaflet-states-pane .leaflet-interactive:nth-child(4)',
          content: 'Click on California to unlock it and then click "Next"',
          spotlightClicks: true,
        },
        {// 8
          disableBeacon: false,
          target: '#covidButton',
          content: 'View and report Asian American/Pacific Islander hate crimes from COVID-19 discrimination here.',
        },      
        {// 9 
          target: '#reportIncidentButton',
          content: 'Anonymously report a hate crime if you yourself have experienced or have witnessed one.',
          disableBeacon: false,
        },      
        {// 10
          target: '#hateCrimeTutorial',
          content: 'You can view this tutorial again by clicking this button.',
        },      
      ]




      /*
      Data objects passed in when you click "next" from the pie charts 

(first one-> should be step:before)
action: "next"
controlled: true
index: 5
lifecycle: "init"
size: 11
status: "running"
step: {showProgress: false, showSkipButton: true, locale: {…}, styles: {…}, disableCloseOnEsc: false, …}
type: "error:target_not_found"
__proto__: Object

(second one-> should be the actual lifecycle step)
action: "update"
controlled: true
index: 5
lifecycle: "ready"
size: 11
status: "running"
step: {showProgress: false, showSkipButton: true, locale: {…}, styles: {…}, disableCloseOnEsc: false, …}
type: "error:target_not_found"
__proto__: Object

(third one -> seems that the normal cycle continues, goes on to step:after without worrying whether the target actually mounted)
action: "next"
controlled: true
index: 5
lifecycle: "complete"
size: 11
status: "running"
step: {showProgress: false, showSkipButton: true, locale: {…}, styles: {…}, disableCloseOnEsc: false, …}
type: "step:after"
__proto__: Object



Data objects passed in when you click next after actually closing the data table?
confused -> when you close the data table and then click next, what I wrote actually funcitons correctly 
seems like at any point during the step index "5", if the target cannot be found it restarts the step and goes through whole lifecycle to 
      */


