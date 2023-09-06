// const latlng = '34.111745,-118.113491';
// const [lat, lng] = latlng.split(',');
// console.log(lat, lng);

const unit = 'mi';
const distance = '400';
const radius =
  unit === 'mi' ? Number(distance) / 3963.2 : Number(distance) / 6378.1;

console.log(radius);
