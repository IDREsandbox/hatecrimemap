import React from 'react';

import AboutDialog from './AboutDialog';

describe('AboutDialog', () => {
  it('renders without crashing', () => {
    shallow(<AboutDialog />);
  });

  it('renders div element', () => {
    expect(shallow(<AboutDialog />).find('.aboutDialogContainer').length).toEqual(1);
  });

  it('renders a AboutDialog element', () => {
    expect(shallow(<AboutDialog />).find('.header').length).toEqual(1);
  });
});
