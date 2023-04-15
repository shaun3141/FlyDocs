import { Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import styled from "@emotion/styled";
import { Bebas_Neue } from "next/font/google";
const header_text = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

export const StyledHeader = styled.h1`
  font-family: ${header_text.style.fontFamily};
  color: red;
  text-align: center;
`;
export const FeatureHeader = styled.div`
  padding: 3px;
  font-weight: bold;
`;

export const Feature = function (props: {
  supported: boolean;
  feature: string;
}) {
  return (
    <Box sx={{ padding: "3px 10px" }}>
      {props.supported ? (
        <CheckCircleIcon
          style={{ verticalAlign: "middle", marginRight: "10px", color: "red" }}
        />
      ) : (
        <CancelIcon style={{ verticalAlign: "middle", marginRight: "10px" }} />
      )}
      {props.feature}
    </Box>
  );
};
