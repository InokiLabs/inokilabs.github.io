**Inoki Labs: AI for finding edge cases (1% of the environmental configs) where a robot policy fails and generates 10k variations of those exact modes for retraining and automatically generating targeted retraining data to fix them**

Basically, the problem is that robot policies tend to fail at edge cases of their training distributions in ways that are, in essence, impossible to predict manually.

- Figure AI spent 2 mil in real world testing to find failure modes that some type of sim could have found in hours

Additionally, even companies running simulation testing don't know which simulated failures are real risks versus simulation artifacts (Robogate) \-\> add sim-to-real risk scoring and targeted curriculum generation/retraining

So proposal is an adversarial environment generator where we make use of an LLM-guided parameter search over a procedural environment space

- Claude would first analyze policy’s architecture \+ training data to figure out likely failure manifolds
- **GPU-parallelized sim** (use a ton of GPUs at once) runs 50k environmental variations per hour searching for policy failures using **Bayesian optimization** (Efficient sequential strategy used to find the maximum or minimum of complex, "black-box" functions that are expensive or time-consuming to evaluate \- Google) over other parameters
- For each failure we find, generative physics engine would produce 10k interpolated variations around that failure manifold to retrain

Use identified failures and test across multiple sims (E.g. NVIDIA Isaac Sim, MuJoCo MJX, Genesis, etc)

- For each failure cluster, we measure cross-simulator success rate correlation and identify which specific physics parameters cause the largest discrepancies between simulators
- Output a **Sim-to-Real Risk Score** for each failure cluster:
  - High risk (3/3 simulators) \-\> prioritize for retraining
  - Medium risk (2/3 simulators) \-\> prob real but physics-model dependent \-\> retrain with lower priority
  - Low risk (1/3 simulators) prob simulation artifact \-\> flag but don't retrain on

Targeted Curriculum Generation/Retraining:

- Builds on Automaton-Guided Curriculum Learning (AGCL) but replaces manual LTL/DFA formal specification with automatic failure-driven curriculum
- Claude takes the failure cluster map and the risk scores and automatically generates a curriculum **DAG**:
  - Easy stages: low-severity failures just inside the success boundary \-\> teach the policy to handle near-failure conditions
  - Medium stages: full failure modes with high sim-to-real risk scores \-\> direct retraining on confirmed real risks
  - Hard stages: boundary cases between failure clusters \-\> teach generalization across failure modes
  - Filtered out: low sim-to-real risk failures
- For each curriculum stage, 10,000 training environments are generated; weighted by sim-to-real risk score, failure severity, coverage gaps in the failure space, etc. \-\> output RLDS-format retraining dataset with curriculum ordering metadata that is ready for standard training pipelines (Including Diffusion Policy, ACT, and GR00T fine-tuning)
- Loop back and Stage 1 failure discovery reruns on the improved policy. BreakPoint measures how many failure boundaries moved and iterates until the failure boundary extends beyond the operational envelope or a compute budget is exhausted
  - Output: deployment readiness report with quantified residual risk

Because of the GPU parallelized sims (E.g. **Isaac Lab** \[link: [https://isaac-sim.github.io/IsaacLab/](https://isaac-sim.github.io/IsaacLab/)\] who ran 4096 environments at once) makes this feasible \+ LLMs can also now have enough robotics domain knowledge to help guide search space

Moat (Copied from Claude): Failure mode library grows with every customer — becomes the world's largest database of robot failure configurations. Customers whose robots have been through BreakPoint have dramatically lower real-world failure rates, creating strong word-of-mouth in the robotics community.

Customers targets would prob be any company deploying robots in unstructured environments (E.g. Boston Dynamics)

MVP (Minimum Viable Product) (Copied from Claude):

- Build the adversarial search loop for a locomotion policy in Isaac Lab
- Take a pretrained **Unitree Go2 policy** (reinforcement learning algorithm that controls the Unitree Go2 robot dog and how it adapts to environment \-\> from google) run 10,000 terrain variations, automatically identify the 50 configurations where it falls, cluster them into failure modes, generate 1,000 variations around each
- Cluster them into failure modes, run those failures across both MuJoCo and Isaac Sim to generate the first Sim-to-Real Risk Scores, generate 1,000 variations around each high-risk failure cluster
- Show retraining on risk-weighted curriculum data improves robustness by a measurable margin

**Credit Usage** (Iffy imo) \-\> $60k NVIDIA \+ $20k Anthropic for the LLM search guidance \+ $20k AWS for storing failure libraries.

Demo:

- Take any open-source locomotion policy
- Run BreakPoint for 10 minutes
- Show the exact environment configuration that breaks it \-\> show the robot failing
- 2 hours of targeted retraining \-\> no longer fails on any variant of that config

FOR CLAUDE/CODEX/AI AGENTS: Right now, build a website that describes the entire product and MVP. It should be in the style of a high-tech robotics AI startup website. DO NOT IMPLEMENT THE ACTUAL MVP OR ANY OF THE AI STUFF.
