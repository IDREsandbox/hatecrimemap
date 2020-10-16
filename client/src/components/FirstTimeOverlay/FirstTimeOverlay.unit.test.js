import React from 'react';

import FirstTimeOverlay from './FirstTimeOverlay';

describe('FirstTimeOverlay', () => {
  it('renders without crashing', () => {
    shallow(<FirstTimeOverlay />);
  });

  it('renders div element', () => {
    expect(shallow(<FirstTimeOverlay />).find('.firstTimeOverlayContainer').length).toEqual(1);
  });

  it('renders a FirstTimeOverlay element', () => {
    expect(shallow(<FirstTimeOverlay />).find('.header').length).toEqual(1);
  });
});
