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
          target: '#hatecrimeBarChart',
          content: 'Click anywhere within a bar section in the chart to see details, and then click "Next".',
          spotlightClicks: true,
          disableBeacon: true,
        },
        {// 4
          target: '#hatecrimePieChart',
          content: 'Click on a pie chart slice to open the data table for that state, and then click "Next". ',
          spotlightClicks: true,
          disableBeacon: true,
          disableOverlay:true,
          hideBackButton: true,
        },
        {// 5
          target: '#hateCrimeDataTable',
          content: 'This is the individual incident reports. Click "Close" to close the table and then click next.',
          disableOverlay:true,
          disableBeacon: true,
          spotlightClicks: true,
          hideBackButton: true,
          placement: 'center',
        },
        {// 6
          disableBeacon: false,
          target: '#chartbackButton',
          spotlightClicks: true,
          disableOverlay:true,
          content: 'Click on the "Back" button return to the previous chart, then click "Next".',
          hideBackButton: true,
        },      
        {// 7
          target: '.leaflet-states-pane .leaflet-interactive:nth-child(4)',
          content: 'Click on California to unlock it and then click "Next"',
          spotlightClicks: true,
          disableBeacon:true,
          disableScrolling: true,
          hideBackButton: true,
        },
        { // 8 (new step -> force the user to zoom in onto counties instead of manually doing it )
          target: '.leaflet-container',
          content: 'Zoom in on the map to view incidents within individual counties.',
          disableOverlay: true,
          spotlightClicks: true,
          disableBeacon:true,
          hideBackButton: true,
        },
        { //9
          target: '.leaflet-container',
          content: 'Incidents can also be viewed at a county level on the map with the same functionality as states.',
          spotlightClicks: true,
          disableBeacon: true,
        },
        { // 10 
          target: '.leaflet-container',
          content: 'Zoom out on the map to view incidents at a state level again.',
          disableOverlay: true,
          spotlightClicks: true,
          disableBeacon:true,
        },
        {// 11
          target: '.map-bar',
          content: 'Use this location switcher to jump to view incidents within Alaska and Hawaii',
          spotlightClicks: true,
          hideBackButton: true,
        },
        {// 12 
          /* NOTE
          * add functionality here that the user can actually click on the covid section to explore it and then return back to the homepage
          */
          disableBeacon: false,
          disableOverlay: true,
          target: '#covidButton',
          content: 'View and report Asian American/Pacific Islander hate crimes from COVID-19 discrimination here.',
        },      
        {// 13 
          target: '#reportIncidentButton',
          content: 'Anonymously report a hate crime if you yourself have experienced or have witnessed one.',
          disableBeacon: false,
          hideBackButton: true,
        },      
        {// 14
          target: '#hateCrimeTutorial',
          content: 'You can view this tutorial again by clicking this button.',
        },      
      ]


export const COVID_JOYRIDE_STEPS = [
  {// 0
          disableBeacon: true,
          showSkipButton: false,
          disableOverlay: true,
          target: '#homepage-button',
          content: 'This is the page to view covid related incidents. Click "See all hate crimes" to continue the tutorial on the home page or close to end the tutorial here.',
  },
  { // dummy step, so as not not show a finish button
    target: '.leaflet-container',
    content: 'dummy step',
  }
]