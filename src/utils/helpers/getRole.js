export const getRole = (value) => {
  let label;
  switch (value) {
    case 0:
      label = "User";
      break;
    case 1:
      label = "Admin";
      break;
    case 2:
      label = "Organizer";
      break;
    default:
      label = "";
      break;
  }

  return label;
};

export const getColor = (value) => {
  let color;
  switch (value) {
    case 0:
      color = "primary";
      break;
    case 1:
      color = "secondary";
      break;
    case 2:
      color = "success";
      break;
    default:
      color = "";
      break;
  }

  return color;
};
