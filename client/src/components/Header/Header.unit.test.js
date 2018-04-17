import React from 'react';

import Header from './Header';

describe('Header', () => {
  it('renders without crashing', () => {
    shallow(<Header />);
  });

  it('renders div element', () => {
    expect(shallow(<Header />).find('.headerContainer').length).toEqual(1);
  });

  it('renders a header element', () => {
    expect(shallow(<Header />).find('.header').length).toEqual(1);
  });
});
