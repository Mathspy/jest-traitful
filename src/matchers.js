import methodlessly from "./matchers/methodlessly";
import traitfully from "./matchers/traitfully";

export default {
  symmetric: {
    ...methodlessly.symmetric,
    ...traitfully.symmetric,
  },
  asymmetric: {
    ...methodlessly.asymmetric,
    ...traitfully.asymmetric,
  },
};
