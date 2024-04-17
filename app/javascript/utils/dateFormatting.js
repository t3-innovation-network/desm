import Moment from 'moment';

export const dateTimeLongFormat = (date) => {
  return date ? Moment(date).format('MMMM Do YYYY, h:mm:ss a') : '';
};

export const dateLongFormat = (date) => {
  return date ? Moment(date).format('MMMM Do YYYY') : '';
};
