export const site = {
  name: 'SII',
  fullName: 'Scientific Intelligence Index',
  repository: 'https://github.com/Science-Intelligence-Index/RSI-Last-Exam',
  contactEmail: null,
  workbenchUrl: null,
  updated: '2026-10-25',
};
export const locales = ['zh', 'en'];
export const routes = ['', 'approach', 'domains', 'domains/materials', 'domains/omics', 'explore', 'ecosystem/rsi4science', 'tasks/molp2s', 'resources/molp2s', 'demos/molp2s', 'docs/quickstart', 'contribute', 'updates', 'about', 'policies'];
export const domains = [
  { id:'materials', color:'#B98664', soft:'#FBF1E8', ink:'#865333', title:['化学与材料','Chemistry & materials'], subtitle:['从性质证据，到结构判断。','From property evidence to structural decisions.'], status:['教学试点','Teaching pilot'], state:'pilot', text:['从分子性质与候选结构的关系出发，组织有来源、可核查的任务与反馈。','Build traceable, checkable tasks around molecular properties and candidate structures.'], need:['材料领域经验、科学案例与证据核查。','Materials expertise, scientific cases and evidence review.'] },
  { id:'omics', color:'#6F9993', soft:'#EDF5F3', ink:'#3B6D65', title:['生物与多组学','Biology & multi-omics'], subtitle:['连接不同观测，定义新的问题。','Connect observations. Define new questions.'], status:['筹备中','In preparation'], state:'planning', text:['与领域研究者共同明确首个科学问题、数据条件和可接受的验证依据。','Define the first scientific question, data conditions and validation criteria with domain researchers.'], need:['科学问题、公开资源与领域经验。','Scientific questions, public resources and domain expertise.'] },
  { id:'physics', color:'#708EAD', soft:'#EDF3F9', ink:'#385A7C', title:['物理','Physics'], subtitle:['用条件与观测约束科学判断。','Constrain scientific decisions with evidence.'], status:['合作兴趣','Seeking collaborators'], state:'interest', text:['探索计算、模拟和实验记录中的可验证问题。','Explore checkable questions in computation, simulation and experimental records.'], need:['一个范围清楚、验证方式明确的问题。','A bounded problem with explicit validation criteria.'] },
  { id:'math', color:'#9588AA', soft:'#F3F0F8', ink:'#645378', title:['数学与算法','Mathematics & algorithms'], subtitle:['让每条推断都有可检查的依据。','Make each inference checkable.'], status:['合作兴趣','Seeking collaborators'], state:'interest', text:['探索可验证推断与后续新问题之间的学习空间。','Explore learning across verifiable reasoning tasks and fresh problems.'], need:['问题族、参考验证与不同条件的实例。','Problem families, reference checks and varied instances.'] },
  { id:'ai', color:'#718FA2', soft:'#EFF4F7', ink:'#405F74', title:['计算机科学与 AI','Computer science & AI'], subtitle:['将研究流程组织成可复现的任务。','Turn research workflows into reproducible tasks.'], status:['合作兴趣','Seeking collaborators'], state:'interest', text:['关注方法、工具和研究策略的可复用性。','Study reusable methods, tools and research strategies.'], need:['研究任务、执行接口和可复现产物。','Research tasks, execution interfaces and reproducible artifacts.'] },
  { id:'climate', color:'#8D9D79', soft:'#F2F5ED', ink:'#55653F', title:['地球与气候','Earth & climate'], subtitle:['在变化的条件中检验知识。','Test knowledge under changing conditions.'], status:['合作兴趣','Seeking collaborators'], state:'interest', text:['探索有时空条件、科学约束与明确检验依据的任务。','Explore tasks with spatial and temporal conditions and scientific constraints.'], need:['观测范围、条件变化与独立检验单元。','Observation scope, changing conditions and independent test units.'] },
  { id:'social', color:'#B18D97', soft:'#F8F0F2', ink:'#805565', title:['社会与行为科学','Social & behavioral science'], subtitle:['保留研究条件与结论边界。','Preserve context and the limits of conclusions.'], status:['合作兴趣','Seeking collaborators'], state:'interest', text:['共同定义有可靠证据、可追溯条件的研究任务。','Define research tasks grounded in evidence and documented conditions.'], need:['科学问题、数据使用范围与有效性标准。','Scientific questions, data-use scope and validity criteria.'] },
];
export const questions = [
  { title:['完成科学任务','Solve a scientific task'], question:['结果是否成立？','Does the result hold?'], text:['在明确的科学条件下，检查答案、计算与支持结论的证据。','Check answers, computations and supporting evidence under explicit scientific conditions.'], icon:'check' },
  { title:['从经验中学习','Learn from experience'], question:['经验能否用于新问题？','Does experience transfer?'], text:['在独立的新任务中，检验此前经验是否改善了后续问题解决能力。','Use fresh, independent tasks to test whether prior experience improves later problem solving.'], icon:'network' },
  { title:['改进学习的方法','Improve the learning process'], question:['改进方法是否也在进步？','Does the improver improve?'], text:['进一步研究：修订后的改进程序，是否带来了更好的后续改进。','Study whether a revised improvement procedure produces better subsequent revisions.'], icon:'loop' },
];
export const rsi4science = {
  home: 'https://rsi4science.org/',
  catalog: 'https://rsi4science.org/datasets/',
  molp2s: 'https://rsi4science.org/use/molp2s/',
  news: 'https://rsi4science.org/news/',
  contribute: 'https://rsi4science.org/contribute/',
  maintainer: 'https://dual.xiongyexiao.com/',
};
export const resourceHref = (resource, lang) => resource.path ? `/${lang}/${resource.path}/` : resource.externalUrl;
export const resources = [
  {id:'task',type:'task',domainIds:['materials'],keywords:['MolP2S','分子','molecule'],title:['分子性质与候选结构判断','Molecular properties & candidate structures'],summary:['给定计算性质证据，比较两个候选结构。当前为一个公开教学族。','Compare two candidate structures using computed property evidence. One public teaching family.'],status:['教学可用','Teaching example'],path:'tasks/molp2s',kind:['科学任务','Scientific task']},
  {id:'source',type:'resource',domainIds:['materials'],keywords:['MolP2SBench','QM9S','来源','citation'],title:['MolP2SBench 原始资源','MolP2SBench source resource'],summary:['了解原始研究、SII 教学适配与 RSI4Science 使用入口，查阅出处与使用范围。','Find the original research, SII teaching adaptation and RSI4Science guide, with attribution and reuse notes.'],status:['原始来源','Original source'],path:'resources/molp2s',externalUrl:'https://github.com/DUAL-Xiao/MolP2SBench',externalLabel:['原始仓库','Source repository'],kind:['数据与资源','Data & resources']},
  {id:'demo',type:'tool',domainIds:['materials'],keywords:['MolP2S','演示','walkthrough'],title:['双观测教学演示','Two-observation walkthrough'],summary:['完成两次选择，再查看参考与反馈。不调用模型，不记录你的选择。','Make both choices, then inspect references and feedback. No model calls or stored responses.'],status:['浏览器内使用','In your browser'],path:'demos/molp2s',kind:['教学工具','Teaching tool']},
  {id:'rsi4science',type:'platform',domainIds:[],keywords:['RSI4Science','社区','community','科学资源','cross-disciplinary'],title:['RSI4Science 科学资源社区','RSI4Science resource community'],summary:['面向科学 AI 的独立资源平台。从分子教学案例开始，浏览资源、研究动态与参与方式。','An independent resource platform for scientific AI. Start with molecular teaching examples and explore resources, research notes and ways to participate.'],status:['独立网站','Independent website'],path:'ecosystem/rsi4science',externalUrl:rsi4science.home,externalLabel:['访问独立网站','Visit the website'],kind:['社区平台','Community platform']},
];
export const updates = [
  {id:'ecosystem',date:'2026-10-25',kind:['资源与社区','Resources & community'],title:['连接 RSI4Science 与 MolP2S 公开资源','Connecting RSI4Science and public MolP2S resources'],text:['新增独立平台介绍，区分原始研究、SII 教学体验和社区使用入口，支持按类型与领域发现资源。','A new platform introduction distinguishes original research, SII teaching and community usage, with resource discovery by type and domain.'],path:'ecosystem/rsi4science'},
  {id:'site',date:'2026-10-18',kind:['项目进展','Project update'],title:['SII 主站首版开始建设','Building the first SII website'],text:['以研究方法、领域试点和合作入口为核心，逐步建立公开阅读与教学体验。','The first version connects our research approach, domain pilots and contribution pathways.'],path:'about'},
  {id:'material',date:'2026-10-18',kind:['领域笔记','Domain note'],title:['从一个分子教学族开始','Starting with one molecular teaching family'],text:['现有适配包含两条计算性质观测，用于检查任务接口与反馈流程。','The teaching adaptation uses two computed-property observations to illustrate task interfaces and feedback.'],path:'tasks/molp2s'},
  {id:'omics',date:'2026-10-18',kind:['筹备方向','In preparation'],title:['共同定义多组学的第一个问题','Defining the first multi-omics question'],text:['多组学方向正在整理问题范围、数据条件与验证思路，欢迎从一个具体案例开始。','We are organizing problem scope, data conditions and validation ideas, starting with a concrete case.'],path:'domains/omics'},
];
