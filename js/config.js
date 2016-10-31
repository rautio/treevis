require.config({
  paths: {
    d3: 'lib/d3.v4.min', // Local
    tree: 'tree',
    jquery: 'lib/jquery-3.1.1.min',
    rainbowvis: 'lib/rainbowvis'
  },
  shim: {
  }
});
require(['tree']);