## [1.4.7](https://github.com/brewcoua/webwisp-lib/compare/v1.4.6...v1.4.7) (2024-06-14)


### Bug Fixes

* **pkg:** remove type module to avoid es module error ([51c1b8c](https://github.com/brewcoua/webwisp-lib/commit/51c1b8c36f06ac1ee62b37d5d8b7f0eaddf5ef22))

## [1.4.6](https://github.com/brewcoua/webwisp-lib/compare/v1.4.5...v1.4.6) (2024-06-14)


### Bug Fixes

* **build:** switch format to cjs ([06ef1c3](https://github.com/brewcoua/webwisp-lib/commit/06ef1c38cb19bd6f2d7b0cba95098634dcbf290e))

## [1.4.5](https://github.com/brewcoua/webwisp-lib/compare/v1.4.4...v1.4.5) (2024-06-14)


### Bug Fixes

* **prompts:** use relative path for example screenshots and pack assets ([3fd5c61](https://github.com/brewcoua/webwisp-lib/commit/3fd5c61b66a9be9cfb4bf2ae4d4bebd414ae08bd))

## [1.4.4](https://github.com/brewcoua/webwisp-lib/compare/v1.4.3...v1.4.4) (2024-06-14)


### Bug Fixes

* **runner:** remove unnessary args from event methods ([951b9ef](https://github.com/brewcoua/webwisp-lib/commit/951b9efbe766f086071c26236a120dbd40ae1e67))

## [1.4.3](https://github.com/brewcoua/webwisp-lib/compare/v1.4.2...v1.4.3) (2024-06-14)


### Bug Fixes

* **runner:** add on_action and on_status for events ([67990a4](https://github.com/brewcoua/webwisp-lib/commit/67990a45c77fc4f229e325aa07350fa054a3e006))

## [1.4.2](https://github.com/brewcoua/webwisp-lib/compare/v1.4.1...v1.4.2) (2024-06-14)


### Bug Fixes

* **runner:** replace enum runner status with basic string type ([f0b735f](https://github.com/brewcoua/webwisp-lib/commit/f0b735fe43b401dfc7d212068d838076cf1e9c44))

## [1.4.1](https://github.com/brewcoua/webwisp-lib/compare/v1.4.0...v1.4.1) (2024-06-14)


### Bug Fixes

* **lib:** export runner status type ([f16f235](https://github.com/brewcoua/webwisp-lib/commit/f16f2352f87c71e39dd4590588ec48b0dae47a6f))

# [1.4.0](https://github.com/brewcoua/webwisp-lib/compare/v1.3.1...v1.4.0) (2024-06-14)


### Features

* **package:** rename webwisp to @webwisp/lib ([21b20f7](https://github.com/brewcoua/webwisp-lib/commit/21b20f79126a74b20e6244b81298f1b515a8e853))

# [1.3.0](https://github.com/brewcoua/webwisp/compare/v1.2.0...v1.3.0) (2024-06-13)


### Features

* **runner:** add events for actions and status ([2de33c1](https://github.com/brewcoua/webwisp/commit/2de33c16c5faf0986cb645bd377d32eff706d7ee))

# [1.2.0](https://github.com/brewcoua/webwisp/compare/v1.1.1...v1.2.0) (2024-06-13)


### Features

* **page:** add method to get remote debugging url ([665c275](https://github.com/brewcoua/webwisp/commit/665c2758f33c6c373566f112eceac09e11c00f2b))

## [1.1.1](https://github.com/brewcoua/webwisp/compare/v1.1.0...v1.1.1) (2024-06-13)


### Bug Fixes

* only build lib for release ([94691bc](https://github.com/brewcoua/webwisp/commit/94691bc25d5b4e0b27fa13090cd603e04670c9ca))

# [1.1.0](https://github.com/brewcoua/webwisp/compare/v1.0.0...v1.1.0) (2024-06-13)


### Bug Fixes

* add dotenv ([a97962f](https://github.com/brewcoua/webwisp/commit/a97962f153c70d5c93391b136abc7a77d783e247))
* add override flag to dotenv ([1d54cd6](https://github.com/brewcoua/webwisp/commit/1d54cd6e9dbb5fa8f5b033a3084c5b13f6e0cd5e))
* **agent:** avoid starting the runner right away ([814b748](https://github.com/brewcoua/webwisp/commit/814b7489403e6da55ff456186d69a3c7ad18ec52))
* **agent:** avoid streaming functions and add element resolving ([c6677b8](https://github.com/brewcoua/webwisp/commit/c6677b847f6e2b34ba6c9ab2cd825c708cd82bbd))
* **agent:** considerably reduce token usage through limits and prompt rules ([ca7327b](https://github.com/brewcoua/webwisp/commit/ca7327b976ac3b1c1dc96d2c30cd9211417bf070))
* **agent:** delete user message after run to avoid exponential context ([621aeee](https://github.com/brewcoua/webwisp/commit/621aeee2bbbeb521a4f6b3b1f8cf5b692524a5f4))
* **browser:** pre-create folder with the right path ([ce10de0](https://github.com/brewcoua/webwisp/commit/ce10de04e9d52836b212f55bc21dc3d3b940b348))
* **grounding:** pre-check if screenshot dir exists ([8402599](https://github.com/brewcoua/webwisp/commit/84025996cbe19d42acb6c20dbfd35a6eb0ff918d))
* **grounding:** use unix timestamps for screenshots ([1843c6f](https://github.com/brewcoua/webwisp/commit/1843c6fa5ba0c9d20ef94a1240c37ae5c0de4f4e))
* **logger:** add more information for errors & add missing loglevel ([9c8771f](https://github.com/brewcoua/webwisp/commit/9c8771f95013bfcd38d4718112a7ec484fb5b248))
* **mind:** properly give the screenshot with the prompt ([e09e72e](https://github.com/brewcoua/webwisp/commit/e09e72e932583dca0cafb406121bcbffbeb001ea))
* **parser:** ignore additional arguments ([c658844](https://github.com/brewcoua/webwisp/commit/c658844f9571f3855a110fa02269bea893a06beb))
* **parser:** missing last arg when parsing and remove prefix from descriptions ([c654ed7](https://github.com/brewcoua/webwisp/commit/c654ed78d159f5656fb08795db76da2877db70a3))
* **prompt:** invalid enum options for role ([5b95bdf](https://github.com/brewcoua/webwisp/commit/5b95bdf582a18a40757cd8c5ecb79f20b06d846f))
* **prompt:** lessen regex validation for urls ([e731cba](https://github.com/brewcoua/webwisp/commit/e731cba56f8955427975222c0948227230fced48))
* **prompt:** remove all transformers for target prompt ([30a6bd8](https://github.com/brewcoua/webwisp/commit/30a6bd80c48dfa814c20bf66b4c015d3eeffdc25))
* **prompt:** use URL object to validate targets ([e77d7a3](https://github.com/brewcoua/webwisp/commit/e77d7a37e6400b8407a9e6d36a196da39d7a652f))
* **rollup:** switch to ES format ([16bc8aa](https://github.com/brewcoua/webwisp/commit/16bc8aae2369a2dbb4c1fa617c9c42309b904830))
* **rollup:** switch to umd for build format ([3291470](https://github.com/brewcoua/webwisp/commit/32914701a0401f2d4fd32870e1d4d78acbcaa721))
* **runner:** typo in arguments name for typing ([6e9be23](https://github.com/brewcoua/webwisp/commit/6e9be23a67ae8c2edc99e0e295ac38f3fe16db00))
* **service:** remove useless env-var generating errors ([1c9ed4b](https://github.com/brewcoua/webwisp/commit/1c9ed4ba7bd6e1c0fd9d0aaad64c3d78dac0b16c))
* **stream:** avoid event race conditions ([eb91bca](https://github.com/brewcoua/webwisp/commit/eb91bcaf7f0459d0b205a54aeaaa7488e7d015bc))
* **tsconfig:** use target ES2022 ([4d2978f](https://github.com/brewcoua/webwisp/commit/4d2978f576f7586960904e45c4707677833d7474))
* type errors, add typechecks and automatically figure out which runtime to use ([ab080eb](https://github.com/brewcoua/webwisp/commit/ab080ebf11924836bbf9a21118d4f43581837a4b))
* update submodules path ([b076566](https://github.com/brewcoua/webwisp/commit/b076566c577cc7606916f2c26eb0c49384783206))
* **vite:** remove conflicting plugin and use raw tsc for typechecking ([9f3e26e](https://github.com/brewcoua/webwisp/commit/9f3e26eb3ce25eff8b7e28c1605cef6025e9a429))


### Features

* add browser and agent handlers ([1c85c70](https://github.com/brewcoua/webwisp/commit/1c85c70d1a34fd96e1e821323afe05a70dae80d7))
* add cli and inputs to prompt more easily ([d5899dc](https://github.com/brewcoua/webwisp/commit/d5899dc8cbfe7728f94cb66490394bc5d7be26e4))
* add config.ts for configuration ([7ce4f37](https://github.com/brewcoua/webwisp/commit/7ce4f378a2e85f4bd125ecde2933054f863c2664))
* add custom errors and display recursive context ([0628818](https://github.com/brewcoua/webwisp/commit/0628818f70831a6cbdc128db3190f0138bff16f4))
* add library build & bundle typescript types d.ts ([2c8e8c6](https://github.com/brewcoua/webwisp/commit/2c8e8c65f8eb8daffb9035048726c814b3f51610))
* add openai handler ([ecafba4](https://github.com/brewcoua/webwisp/commit/ecafba4349e5bc13cfa843740ee3228b08695b91))
* add prompts for generating code from scenarios ([ddd63f8](https://github.com/brewcoua/webwisp/commit/ddd63f871f047e2438f02ae4ee2ebbffc22f98d4))
* add reasoning for each action ([f9f6fae](https://github.com/brewcoua/webwisp/commit/f9f6faefe52a9bbccc679a857bbb323c5aa7bb04))
* add services and make consts as json ([b378543](https://github.com/brewcoua/webwisp/commit/b378543e4713cb38bd69300b297fd94df1267d66))
* add temperature finetuning ([501a2e7](https://github.com/brewcoua/webwisp/commit/501a2e7c7e66ad175be31cf3a32ff4d03b27fac1))
* add working visual grounding for most tasks ([81a881b](https://github.com/brewcoua/webwisp/commit/81a881bb58bde6ee434b5f2dabc051460537fc02))
* **agent:** add base script for first step ([b15c3d4](https://github.com/brewcoua/webwisp/commit/b15c3d4fa50df37122b6f1e67a08358ed6cf62f9))
* **agent:** add runner for concurrency ([ed06e1d](https://github.com/brewcoua/webwisp/commit/ed06e1d868193d9b1cc46b0e90797c7d895159ac))
* **agent:** add somewhat working script (first step works) ([221eb75](https://github.com/brewcoua/webwisp/commit/221eb75c10625ff7f99c0a772503a02bd9fad3e2))
* **cli:** add voice recording with --voice flag ([10d2dca](https://github.com/brewcoua/webwisp/commit/10d2dca677dec1cb77a8285a017c3cc163f512a8))
* **cli:** add voice task input ([5fda57a](https://github.com/brewcoua/webwisp/commit/5fda57ab5dbae9e2071c6d79bf8ab07db476efb4))
* **config:** add predefined tasks with objectives and scenarios ([cdc31de](https://github.com/brewcoua/webwisp/commit/cdc31decee6bd2867fc9a9240f022db1719a4f9c))
* fully remove low perf grounding methods ([bb0f64e](https://github.com/brewcoua/webwisp/commit/bb0f64e6ed73fcc9d94f39c27dba84d7a632539d))
* **grounding:** add Set-of-Marks grounding method script and allow multiple methods in config ([705cb7f](https://github.com/brewcoua/webwisp/commit/705cb7f884c20f62ec709673c18b835020fd654a))
* **grounding:** add support for the new SoM script ([42f7319](https://github.com/brewcoua/webwisp/commit/42f731920122a9a6a82459862e4453f83959b55d))
* implement all changes from https://github.com/xblanc33/webwisp ([6e732c1](https://github.com/brewcoua/webwisp/commit/6e732c1afd138a6b814081b3b12a0f6d52f68e89))
* implement ways to use multiple grounding methods ([7d1eed0](https://github.com/brewcoua/webwisp/commit/7d1eed04adc61e6e0ab2acce0feee6591bf00bd3))
* **openai:** use completions and functions instead of assistant ([12cbf78](https://github.com/brewcoua/webwisp/commit/12cbf78177f9bb0211db49b974e72ec36ced206f))
* **prompt:** avoid too many neighbors* ([d16f827](https://github.com/brewcoua/webwisp/commit/d16f827bc802fb1bd994285d4d650f31722e9696))
* **prompt:** rewrite prompts for CoT and use less tokens ([8b4bf7d](https://github.com/brewcoua/webwisp/commit/8b4bf7d1035b284b45d716e114be5bb293f7ae77))
* **prompts:** add functions for assistant ([b745801](https://github.com/brewcoua/webwisp/commit/b7458013485dc6d6c7239c723579795af270b3e2))
* **prompts:** switch to using system prompts ([76baacd](https://github.com/brewcoua/webwisp/commit/76baacdd79bac35f7de27f771af38f3775d56b1a))
* **pw:** attempt at resolving inputs better ([76c8c4a](https://github.com/brewcoua/webwisp/commit/76c8c4ac444a5ef73b8031ce269368d27cd17aa7))
* refactor all logs to use winston ([2511834](https://github.com/brewcoua/webwisp/commit/25118343e6fa1b5375e1a7dfdceb130fc8305846))
* refactor the whole architecture + abstract llm modelling ([7d9efaf](https://github.com/brewcoua/webwisp/commit/7d9efafe1806bbed38e348ee6413d3d2b53f2c42))
* **resolver:** select inputs through neighborhood ([f3ecff0](https://github.com/brewcoua/webwisp/commit/f3ecff0b96b780a562095d405a29b843b263c67e))
* **runner:** add additional states for error management ([063a2ec](https://github.com/brewcoua/webwisp/commit/063a2ec0e52e247cb73c424f9a8504d3e55bd1f2))
* **runner:** remove delay between each cycle for faster runs ([d722679](https://github.com/brewcoua/webwisp/commit/d722679280d5ec4ccf3267a915b92b82610cb1ed))
* **SoM:** concurrent element filtering and select through roles ([d718669](https://github.com/brewcoua/webwisp/commit/d718669d5005fa957cce744565698f804fd1d36d))
* **som:** use remote unpkg for loading @brewcoua/web-som ([ba76ba3](https://github.com/brewcoua/webwisp/commit/ba76ba357c86b1801b3f26644e76a0e231628c7b))
* update all prompts to fit CoT and add examples ([1f189b2](https://github.com/brewcoua/webwisp/commit/1f189b275c6d1ad872ff4c89dd1ba55fcab62421))
* use only a single task sentence for browsing ([d345f0d](https://github.com/brewcoua/webwisp/commit/d345f0d61efacbd6f3e8ed277629cb9a09844c3a))
