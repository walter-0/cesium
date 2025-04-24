# WebGPU Migration Journal

## Architecture Overview

### Dependency Graph

```sh
npx depcruise Source --progress --cache --metrics -T dot | dot -T svg > dependency-graph.svg
```

![Dependency Graph](/packages/engine/dependency-graph.svg)

### Source Lines of Code

```sh
sloc Source

---------- Result ------------

            Physical :  356381
              Source :  227809
             Comment :  94312
 Single-line comment :  11647
       Block comment :  82665
               Mixed :  815
 Empty block comment :  13
               Empty :  35088
               To Do :  12

Number of files read :  946

----------------------------
```

## Key Files & Components

{# - [File]: [purpose] #}
{# - [Class]: [responsibility] #}

## WebGL Dependencies
