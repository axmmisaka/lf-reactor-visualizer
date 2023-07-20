import { useRef, useState } from 'react'
//import './App.css'
import { styled } from '@mui/material/styles';
import { Container, Typography, Box, Grid, Paper, TextField, Slider, Button } from '@mui/material';
import { Mermaid } from "./mermaid.jsx"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const renderJSString = (str) => {
  return str.split('\n').map((item, idx) => (
    <span key={idx}>
      {item}
      <br/>
    </span>
  )) 
}

const mermaidExample = "graph\n 0[\"sieve[M0]\"]\n subgraph \"sg0\"\n  1[\"sieve.source.value\"]\n  2[\"sieve.source[R0]\"]\n  3[\"sieve.source[M0]\"]\n end\n subgraph \"sg1\"\n  4[\"sieve.filter.inp\"]\n  5[\"sieve.filter.out\"]\n  6[\"sieve.filter[M0]\"]\n  7[\"sieve.filter[M1]\"]\n end\n subgraph \"sg2\"\n  8[\"sieve.Filter.inp\"]\n  9[\"sieve.Filter.out\"]\n  10[\"sieve.Filter[M0]\"]\n  11[\"sieve.Filter[M1]\"]\n end\n subgraph \"sg3\"\n  12[\"sieve.Filter.inp\"]\n  13[\"sieve.Filter.out\"]\n  14[\"sieve.Filter[M0]\"]\n  15[\"sieve.Filter[M1]\"]\n end\n\n1 --> 4\n2 --> 1\n5 --> 8\n7 --> 5\n9 --> 12\n11 --> 9\n3 --> 2\n0 --> 3\n6 --> 7\n4 --> 7\n0 --> 6\n0 --> 10\n10 --> 11\n8 --> 11\n0 --> 14\n14 --> 15\n12 --> 15\n15 --> 13";
const stacktraceExample = "Error: addEdge\n    at PrecedenceGraph.addEdge (/home/keketang/reactor-ts/src/core/graph.ts:184:17)\n    at Filter._addHierarchicalDependencies (/home/keketang/reactor-ts/src/core/reactor.ts:880:29)\n    at Filter._getPrecedenceGraph (/home/keketang/reactor-ts/src/core/reactor.ts:931:10)\n    at Sieve._getPrecedenceGraph (/home/keketang/reactor-ts/src/core/reactor.ts:941:24)\n    at printSieveGraph (/home/keketang/reactor-ts/src/benchmark/Sieve.ts:148:45)\n    at _mutationSandbox.<anonymous> (/home/keketang/reactor-ts/src/benchmark/Sieve.ts:108:17)\n    at Mutation.doReact (/home/keketang/reactor-ts/src/core/reaction.ts:154:18)\n    at Sieve._react (/home/keketang/reactor-ts/src/core/reactor.ts:2357:11)\n    at Sieve._next (/home/keketang/reactor-ts/src/core/reactor.ts:2471:12)\n    at Sieve.<anonymous> (/home/keketang/reactor-ts/src/core/reactor.ts:2564:16)";
function App() {
  const [sliderSteps, setSliderSteps] = useState(0);
  const [sliderPos, setSliderPos] = useState(0);
  const textRef = useRef("");
  const [data, setData] = useState([{
    time: {seconds: 0, nanoseconds: 30},
    graphMermaidString: mermaidExample,
    stacktrace: stacktraceExample
  }]);

  function parse(str) {
    let parsed;
    try {
      console.log(str);
      parsed = JSON.parse(str);
    } catch (err) {
      console.error(err);
      return;
    }

    if (!(parsed instanceof Array)) {
      console.error("not array");
      return;
    }

    for (const p of parsed) {
      if (!(
          ("time" in p) &&
          ("graphMermaidString" in p) &&
          ("stacktrace" in p)
        )){
        console.error("bad json");
        return;
      }
    }

    setData(parsed);
    setSliderSteps(parsed.length - 1);
  }

  return (
    <div>
      <Container maxWidth="75%">
        <Typography variant="h4" component="h1" textAlign="center" >
          LF Visualizer
        </Typography>
        <Box id="test" sx={{ my: 4, width: 1 }}>
          <Grid container direction="row" justifyContent="space-evenly" spacing={2}>
            <Grid item xs={3}>
              <Slider
                aria-label="timestep"
                defaultValue={0}
                getAriaValueText={(val, idx)=>`${data[val].time.seconds}:${data[val].time.nanoseconds}`}
                valueLabelFormat={(val)=>`${data[val].time.seconds}:${data[val].time.nanoseconds}`}
                valueLabelDisplay="on"
                step={1}
                marks
                min={0}
                max={sliderSteps}
                value={sliderPos}
                onChange={(event) => {setSliderPos(event.target.value)}}
              />
              <TextField 
                id="inputjson" 
                variant='outlined' 
                multiline 
                fullWidth 
                minRows={20}
                inputRef={textRef}
                sx={{maxHeight: 1}}
              />
              <Button
                size="large"
                onClick={() => parse(textRef.current.value)}
              >Parse!</Button>
            </Grid>
            <Grid item xs={5}>
              <Item>
                <Mermaid chart={data[sliderPos].graphMermaidString} />
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography>
                  At logical time {data[sliderPos].time.seconds}:{data[sliderPos].time.nanoseconds}
                </Typography>
                <Typography align='left'>
                  {renderJSString(data[sliderPos].stacktrace)}
                </Typography>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default App
