import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

// Styled components for items
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#303030',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '40px',
  width: '180px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const FullPageContainer = styled(Box)({
  height: '100vh',
  backgroundColor: '#202020',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const RectangleBox = styled(Box)(({ theme }) => ({
  width: '81%',
  height: '60px',
  backgroundColor: '#505050',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
  marginTop: '50px',
  color: theme.palette.text.primary,
  fontSize: '40px',
}));

const CenterItem = styled(Item)({
  height: '400px',
  width: '130px',
  backgroundColor: '#505050',
});

const CustomHeightItem = styled(Item)({
  height: '90px',
});

const ShiftedFrame = styled(CustomHeightItem)({
  marginLeft: '60px',
});

const ShiftedFrame13 = styled(CustomHeightItem)({
  marginRight: '60px',
});

const VerticalLine = styled('div')({
  width: '1px',
  height: '200px', // Adjusted height for the vertical lines
  backgroundColor: 'white',
  position: 'absolute',
});

const HorizontalLine = styled('div')({
  width: '50px', // Adjust width as needed
  height: '1px',
  backgroundColor: 'white',
  position: 'absolute',
});

function HorizontalLineComponent({ leftPosition, topPosition }) {
  return (
    <HorizontalLine
      style={{
        left: leftPosition,  // Adjust the horizontal position
        top: topPosition,    // Adjust the vertical position
      }}
    />
  );
}

function VerticalLineComponent({ leftPosition, topPosition }) {
  return (
    <VerticalLine
      style={{
        left: leftPosition, // Adjust the position based on where you want the line
        top: topPosition,
      }}
    />
  );
}

function FrameWithLine({ frameName, lineStartY }) {
  return (
    <CustomHeightItem>
      {frameName}
      <svg width="50" height="45" style={{ position: 'absolute', left: '100%' }}>
        <line
          x1="0"
          y1={lineStartY}
          x2="100%"
          y2={lineStartY}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </CustomHeightItem>
  );
}

function FrameWithLineBottom({ frameName, lineStartY }) {
  return (
    <CustomHeightItem>
      {frameName}
      <svg width="50" height="45" style={{ position: 'absolute', left: '-50px' }}>
        <line
          x1="100%"
          y1={lineStartY}
          x2="0"
          y2={lineStartY}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </CustomHeightItem>
  );
}

// New component to render Frame 11 and Frame 12 with two horizontal lines
function FrameWithLines({ frameName }) {
  return (
    <CustomHeightItem>
      {frameName}
      {/* First horizontal line */}
      <svg width="55.5" height="45" style={{ position: 'absolute', bottom: '280px', left: '41.91%' }}>
        <line x1="0%" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="2" />
      </svg>
      {/* Second horizontal line */}
      <svg width="76" height="45" style={{ position: 'absolute', bottom: '280px', left: '54.84%' }}>
        <line x1="0%" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="2" />
      </svg>
    </CustomHeightItem>
  );
}

export default function TournamentBracket() {
  return (
    <FullPageContainer>
      <RectangleBox>
        Tournament Title
      </RectangleBox>

      <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ marginTop: '40px' }}>
        <Grid container item xs={2} direction="column" spacing={8} alignItems="center" style={{ position: 'relative' }}>
          <Grid item>
            <FrameWithLine frameName="Frame 1" lineStartY="22.5" />
          </Grid>
          <Grid item>
            <FrameWithLine frameName="Frame 2" lineStartY="22.5" />
          </Grid>
          <Grid item>
            <FrameWithLine frameName="Frame 3" lineStartY="22.5" />
          </Grid>
          <Grid item>
            <FrameWithLine frameName="Frame 4" lineStartY="22.5" />
          </Grid>
        </Grid>

        <Grid container item xs={2} direction="column" spacing={8} alignItems="center">
          <Grid item>
            <CustomHeightItem>Frame 5</CustomHeightItem>
          </Grid>
          <Grid item>
            <ShiftedFrame>Frame 6</ShiftedFrame>
          </Grid>
          <Grid item>
            <CustomHeightItem>Frame 14</CustomHeightItem>
          </Grid>
        </Grid>

        <Grid container item xs={2} direction="column" spacing={4} justifyContent="center" alignItems="center">
          <Grid item>
            <CenterItem>Frame 15</CenterItem>
          </Grid>
          <Grid item>
            <button>GENERATE</button>
          </Grid>
        </Grid>

        <Grid container item xs={2} direction="column" spacing={8} alignItems="center" >
          <Grid item>
            <FrameWithLines frameName="Frame 11" />
          </Grid>
          <Grid item>
            <ShiftedFrame13>Frame 13</ShiftedFrame13>
          </Grid>
          <Grid item>
            <FrameWithLines frameName="Frame 12" />
          </Grid>
        </Grid>

        <Grid container item xs={2} direction="column" spacing={8} alignItems="center">
          <Grid item>
            <FrameWithLineBottom frameName="Frame 7" lineStartY="22.5" />
          </Grid>
          <Grid item>
            <FrameWithLineBottom frameName="Frame 8" lineStartY="22.5" />
          </Grid>
          <Grid item>
            <FrameWithLineBottom frameName="Frame 9" lineStartY="22.5" />
          </Grid>
          <Grid item>
            <FrameWithLineBottom frameName="Frame 10" lineStartY="22.5" />
          </Grid>
        </Grid>
      </Grid>

      {/* Vertical Lines */}
      <VerticalLineComponent leftPosition="24.6%" topPosition="336.35px" />
      <VerticalLineComponent leftPosition="24.6%" topPosition="708.33px" />
      <VerticalLineComponent leftPosition="75.35%" topPosition="336.35px" />
      <VerticalLineComponent leftPosition="75.35%" topPosition="708.33px" />

      {/* Horizontal Lines */}
      <HorizontalLineComponent leftPosition="24.6%" topPosition="46%" />
      <HorizontalLineComponent leftPosition="70.6%px" topPosition="85%" />
      <HorizontalLineComponent leftPosition="69.49%" topPosition="46%" />
      <HorizontalLineComponent leftPosition="69.49%" topPosition="85%" />
    </FullPageContainer>
  );
}
