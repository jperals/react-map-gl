/* eslint-disable no-console */

import React from 'react';
import { mount } from 'enzyme';
import MapGL, { Source, Layer } from '../..';

test('render geojson source', () => {
  const data = { type: 'FeatureCollection', features: [] };

  const wrapper = mount(
    <MapGL latitude={0} longitude={0} zoom={0}>
      <Source id="test" type="geojson" data={data} />
    </MapGL>
  );

  expect(wrapper.find('Source').exists()).toBe(true);

  wrapper.unmount();
  expect(wrapper.find('Source').exists()).toBe(false);
});

test('update geojson source', () => {
  const data1 = { type: 'FeatureCollection', features: [] };
  const data2 = { type: 'FeatureCollection', features: [] };

  const wrapper = mount(
    <MapGL latitude={0} longitude={0} zoom={0}>
      <Source id="test" type="geojson" data={data1} />
    </MapGL>
  );

  wrapper.setProps({
    children: <Source id="test" type="geojson" data={data2} />
  });
});

test('render vector source', () => {
  const wrapper = mount(
    <MapGL latitude={0} longitude={0} zoom={0}>
      <Source id="test" type="vector" url="mapbox://mapbox.mapbox-terrain-v2" />
    </MapGL>
  );

  expect(wrapper.find('Source').exists()).toBe(true);

  wrapper.unmount();
  expect(wrapper.find('Source').exists()).toBe(false);
});

test('update vector source url', () => {
  const wrapper = mount(
    <MapGL latitude={0} longitude={0} zoom={0}>
      <Source id="test" type="vector" url="mapbox://styles/mapbox/light-v9" />
    </MapGL>
  );

  wrapper.setProps({
    children: (
      <Source id="test" type="vector" url="mapbox://styles/mapbox/dark-v9" />
    )
  });
});

test('update vector source tiles', () => {
  const wrapper = mount(
    <MapGL latitude={0} longitude={0} zoom={0}>
      <Source
        id="test"
        type="vector"
        tiles={['https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt']}
      />
    </MapGL>
  );

  wrapper.setProps({
    children: (
      <Source
        id="test"
        type="vector"
        tiles={['https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt?']}
      />
    )
  });
});

test('remove and add new source', () => {
  const data = { type: 'FeatureCollection', features: [] };

  const wrapper = mount(
    <MapGL latitude={0} longitude={0} zoom={0}>
      <Source id="test" type="geojson" data={data} />
    </MapGL>
  );

  wrapper.setProps({
    children: (
      <Source id="test" type="vector" url="mapbox://mapbox.mapbox-terrain-v2" />
    )
  });
});

test('throws', () => {
  console.error = jest.fn();
  const data = { type: 'FeatureCollection', features: [] };

  expect(() =>
    mount(<Source id="test" type="geojson" data={data} />)
  ).toThrow();

  expect(console.error).toHaveBeenCalled();
});

test('do not render children until loaded', () => {
  /* eslint-disable global-require */
  const mapboxgl = require('../../__mocks__/mapbox-gl');
  mapboxgl.Map.prototype.isSourceLoaded = () => false;
  jest.setMock('mapbox-gl', mapboxgl);

  const data = { type: 'FeatureCollection', features: [] };
  const wrapper = mount(
    <MapGL latitude={0} longitude={0} zoom={0}>
      <Source id="test" type="geojson" data={data}>
        <Layer id="test" type="circle" source="test" />
      </Source>
    </MapGL>
  );

  expect(wrapper.find('Layer').exists()).toBe(false);

  wrapper.find('Source').setState({ loaded: true });
  expect(wrapper.find('Layer').exists()).toBe(true);
});
