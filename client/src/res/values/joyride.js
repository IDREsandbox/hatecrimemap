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

        {
          target: '#USA',
          content: 'This is the map panel, hover over states to see their charts. Hover outside the United States to show all of the data again, then click "Next".',
          spotlightClicks: true,
        },

        {
          target: '.leaflet-interactive:nth-child(5)',
          content: 'You can click on a state to lock/unlock it. Click on California to lock it and then click "Next"',
          spotlightClicks: true,
        },
        {
          target: '.sideMenu__chart',
          content: 'Click on a bar in the chart to see details, and then click "Next".',
          spotlightClicks: true,
          disableBeacon: true,
        },
        {
          target: '#hatecrimePieChart',
          content: 'Click on a pie chart slice to open the data table for that state, and then click "Next". ',
          spotlightClicks: true,
          disableBeacon: true,
          disableOverlay:true,
          
        },
        {
          target: '#hateCrimeDataTable',
          content: 'This is the individual incident reports. Click "Close" to exit and then click "Next".',
          disableOverlay:true,
          disableBeacon: true,
          spotlightClicks: true,
          placement: 'center',
        },
        {
          disableBeacon: false,
          target: '#chartbackButton',
          spotlightClicks: true,
          disableOverlay:true,
          content: 'Click on the "Back" button return to the previous chart, then click "Next".',
        },      
        {
          target: '.leaflet-interactive:nth-child(5)',
          content: 'Click on California to unlock it and then click "Next"',
          spotlightClicks: true,
        },
        {
          disableBeacon: false,
          target: '#covidButton',
          content: 'View and report Asian American/Pacific Islander hate crimes from COVID-19 discrimination here.',
        },      
        {
          target: '#reportIncidentButton',
          content: 'Anonymously report a hate crime if you yourself have experienced or have witnessed one.',
          disableBeacon: false,
        },      
        {
          target: '#hateCrimeTutorial',
          content: 'You can view this tutorial again by clicking this button.',
        },      
      ]