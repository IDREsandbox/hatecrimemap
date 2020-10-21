import React from 'react';

import AboutCovidDialog from './AboutCovidDialog';

describe('AboutCovidDialog', () => {
  it('renders without crashing', () => {
    shallow(<AboutCovidDialog />);
  });

  it('renders div element', () => {
    expect(shallow(<AboutCovidDialog />).find('.AboutCovidDialogContainer').length).toEqual(1);
  });

  it('renders a AboutCovidDialog element', () => {
    expect(shallow(<AboutCovidDialog />).find('.header').length).toEqual(1);
  });
});
