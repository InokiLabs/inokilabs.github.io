# Inoki Labs BreakPoint Design

Status: draft  
Date: 2026-05-30  
Source: expanded from the initial draft plan for Inoki Labs and BreakPoint.

## Reader And Post-Read Action

This document is for a founder, robotics engineer, technical designer, or AI agent landing cold on the idea. After reading it, they should be able to plan the BreakPoint MVP, explain the technical architecture, understand the research basis and risks, and build a static product website that introduces Inoki Labs and BreakPoint without implementing the robotics system itself.

## Executive Summary

Inoki Labs is building BreakPoint, an adversarial simulation and retraining-data engine for learned robot policies. The product finds the small slice of operational conditions where a policy fails, validates whether those failures appear to be simulator artifacts or real deployment risks, and generates targeted curriculum data to retrain the policy against the failure manifold.

The core promise:

> BreakPoint finds the 1 percent of environments that break a robot policy, then generates thousands of targeted variations around those exact failure modes for evaluation and retraining.

The initial wedge is locomotion robustness for a Unitree Go2 policy in Isaac Lab. The MVP should search 10,000 to 50,000 terrain and dynamics variations, cluster the configurations where the policy falls or loses control, validate the highest-value clusters in at least one second simulator, generate retraining datasets around high-risk clusters, and show measurable robustness improvement after targeted retraining.

BreakPoint should not be positioned as a full robot safety certification system. It is a pre-deployment robustness layer that turns simulation from broad random testing into targeted failure discovery, risk ranking, and retraining data generation.

## Problem

Learned robot policies often perform well on average and fail in narrow tails of the training or deployment distribution. Those failures are hard to predict manually because they can depend on nonlinear interactions among terrain geometry, friction, actuator delay, payload, perception noise, contact timing, and policy architecture.

Current workflows have four gaps:

1. Manual edge-case testing is incomplete. Engineers test the failures they can imagine, not necessarily the high-dimensional combinations that actually break the policy.
2. Broad domain randomization is inefficient. It improves robustness, but spends most compute on uninformative conditions far from the policy boundary.
3. Simulation can mislead. A failure in one simulator may be a real risk, a physics-model limitation, a bad asset translation, or a solver artifact.
4. Failures are not automatically converted into training assets. Teams often find a bug, fix a scenario manually, and lose the chance to turn it into a reusable failure cluster and curriculum.

BreakPoint addresses these by creating a closed loop:

1. Search for policy failures inside a declared operational envelope.
2. Cluster failures into interpretable modes.
3. Cross-check high-value clusters across multiple simulators.
4. Score each cluster for sim-to-real risk.
5. Generate thousands of curriculum-ordered variants around the high-risk failure modes.
6. Export data and reports that fit standard robot-learning pipelines.
7. Re-run discovery after retraining to measure how the failure boundary moved.

## Research Basis

This section records the research and platform assumptions used to expand the draft.

### GPU-Parallel Robot Simulation Is Now Practical

Isaac Lab is a unified, modular robot-learning framework built on Isaac Sim. Its documentation describes support for reinforcement learning, learning from demonstrations, motion planning, domain randomization, tiled rendering, cloud execution, and ready-to-use assets including Unitree Go2, Unitree Go1, Unitree A1, Boston Dynamics Spot, Unitree H1, and Unitree G1. Source: [Isaac Lab documentation](https://isaac-sim.github.io/IsaacLab/v2.0.1/index.html).

NVIDIA Research describes Isaac Lab as combining high-fidelity GPU-parallel physics, photorealistic rendering, a modular architecture, actuator models, multi-frequency sensors, data pipelines, and domain randomization tools for reinforcement and imitation learning at scale. Source: [NVIDIA Research: Isaac Lab](https://research.nvidia.com/publication/2025-09_isaac-lab-gpu-accelerated-simulation-framework-multi-modal-robot-learning).

MuJoCo MJX provides a JAX and Warp path for running MuJoCo on accelerator hardware. The docs note that MJX is best suited for thousands or tens of thousands of parallel scenes, supports batching through JAX arrays, and includes hardware-accelerated batch rendering in MJX-Warp. Source: [MuJoCo MJX docs](https://mujoco.readthedocs.io/en/latest/mjx.html).

Genesis is an open-source robotics and embodied-AI simulation platform with a universal physics engine, Pythonic simulation APIs, rendering, and planned generative data capabilities. The current open-source release exposes the physics engine and simulation platform; generative features are staged separately. Source: [Genesis GitHub](https://github.com/Genesis-Embodied-AI/Genesis).

Implication for BreakPoint: large-scale environment sweeps are feasible, but the product must treat simulator throughput, contact modeling differences, and simulator feature parity as first-class engineering constraints.

### Existing Evaluation Layers Are Adjacent, Not Identical

NVIDIA Isaac Lab-Arena is an open-source framework for large-scale robot policy setup and evaluation in simulation, with APIs for task curation, diversification, and GPU-parallel evaluation. Source: [Isaac Lab-Arena overview](https://developer.nvidia.com/isaac/lab-arena) and [NVIDIA technical blog](https://developer.nvidia.com/blog/simplify-generalist-robot-policy-evaluation-in-simulation-with-nvidia-isaac-lab-arena/).

RoboGate is an existing validation product and paper that uses adaptive sampling to discover robot-policy failure boundaries. The arXiv abstract describes two-stage sampling, 30,000 Isaac Sim experiments, and a risk model for manipulation scenarios. Source: [ROBOGATE arXiv](https://arxiv.org/abs/2603.22126) and [RoboGate website](https://www.robogate.io/).

Implication for BreakPoint: avoid using "RoboGate" as a product name or category label. Position BreakPoint around failure-directed retraining data and cross-simulator risk scoring, not just pass/fail validation.

### Sim-To-Real Remains The Core Technical Risk

The sim-to-real "reality gap" is the mismatch between simulated and real robot performance caused by imperfect dynamics, sensing, contact, and environment modeling. Survey work emphasizes that simulation is useful for safe and fast training, but modeling errors can produce transfer failures. Source: [Crossing the Reality Gap survey](https://medvet.inginf.units.it/publications/2021-j-sfmp-crossing/).

Domain randomization is widely used to train policies robust to unknown physics and visual parameters, but broad randomization can be inefficient and can still miss operationally important combinations. OpenAI's domain-randomized grasping work is an early example of using randomized simulated objects to transfer to real grasps. Source: [OpenAI domain randomization and grasping](https://openai.com/index/domain-randomization-and-generative-models-for-robotic-grasping/).

Implication for BreakPoint: the product should not claim that simulator agreement proves real-world safety. It should produce a ranked risk signal and explicitly separate "simulator-consistent failure" from "validated real-world failure."

### LLM-Guided Simulation And Curriculum Generation Are Plausible

GenSim uses LLMs to generate robotic simulation tasks and expert demonstrations, including goal-directed curricula and exploratory task generation. Source: [GenSim arXiv](https://arxiv.org/abs/2310.01361).

Eurekaverse shows that LLMs can generate progressively more challenging, diverse, and learnable environment curricula for quadrupedal parkour, with real-world transfer in their setting. Source: [Environment Curriculum Generation via LLMs](https://proceedings.mlr.press/v270/liang25a.html).

ReGen uses LLM-guided causal graph expansion and symbolic programs to generate robot simulations and corner cases from behavior and text descriptions. Source: [ReGen project](https://regen-sim.github.io/).

Automaton-Guided Curriculum Learning (AGCL) generates curriculum DAGs from deterministic finite automata and object-oriented MDP descriptions. Source: [AGCL paper](https://ojs.aaai.org/index.php/ICAPS/article/view/27242).

Implication for BreakPoint: an LLM can help propose search priors, failure hypotheses, curriculum stage descriptions, and report language. It must not be the source of truth for pass/fail labels, safety claims, or simulator validation.

### Retraining Format Should Meet Existing Policy Pipelines

Diffusion Policy represents robot behavior as a conditional denoising diffusion process, uses receding-horizon action sequences, and reports strong performance across manipulation benchmarks. Source: [Diffusion Policy project](https://diffusion-policy.cs.columbia.edu/) and [arXiv](https://arxiv.org/abs/2303.04137).

Action Chunking with Transformers (ACT) learns a generative model over action sequences and was introduced with the ALOHA system for imitation learning. Source: [ACT/ALOHA arXiv](https://arxiv.org/abs/2304.13705).

NVIDIA Isaac GR00T is an open vision-language-action foundation model family for generalist humanoid robot skills, with a public N1.7 repository as of this document date. Source: [NVIDIA Isaac-GR00T GitHub](https://github.com/NVIDIA/Isaac-GR00T).

RLDS is an ecosystem and format for recording, replaying, manipulating, annotating, and sharing sequential decision-making datasets, including RL, offline RL, and imitation learning. Source: [RLDS arXiv](https://arxiv.org/abs/2111.02767) and [google-research/rlds](https://github.com/google-research/rlds).

Implication for BreakPoint: MVP data export should be simple enough for locomotion retraining, but the schema should preserve episode, step, parameter, failure-cluster, and curriculum metadata so it can later map into RLDS, LeRobot-style datasets, Diffusion Policy, ACT, and GR00T fine-tuning workflows.

## Draft Assumptions To Treat Carefully

The draft mentions that Figure AI spent "$2M in real world testing" to find failure modes that simulation could have found faster. I could not verify that exact claim from reliable sources during research. Do not use it as a factual statement in the website or pitch deck unless a primary source is found.

Use the broader, defensible claim instead:

> Real-world robot testing is expensive, slow, and risky, while simulation can cheaply expose many candidate failures before hardware is touched.

## Product Definition

BreakPoint is a failure-discovery and retraining-data system with five product surfaces:

1. Failure search: run massive parallel simulation sweeps to find edge-case configurations where the target policy fails.
2. Failure clustering: group individual failed rollouts into failure modes with parameter ranges, trajectory signatures, and example videos.
3. Sim-to-real risk scoring: cross-check failure clusters across multiple simulator backends and compute a risk tier.
4. Curriculum generation: produce stage-ordered environment distributions around each high-risk failure mode.
5. Deployment readiness report: quantify discovered failure modes, retraining lift, residual risk, and held-out robustness.

The product should be described as a "policy robustness data engine" rather than just a testing tool. The business value is not only finding failures, but converting failures into structured data that improves the policy.

## Non-Goals

BreakPoint should not attempt these in the MVP:

1. No claim of formal safety certification.
2. No real robot hardware control.
3. No automatic deployment to production robots.
4. No universal multi-embodiment support.
5. No humanoid foundation model fine-tuning in the first build.
6. No fully generative physics engine implementation.
7. No replacement for customer-specific real-world validation.

The draft explicitly says: do not implement the actual MVP or AI system for the current website task. This design document includes the technical plan, but the immediate build should be a website introducing the product and MVP.

## MVP Scope

### Target Scenario

Use a pretrained or easily trainable Unitree Go2 locomotion policy in Isaac Lab. The policy should be evaluated across procedural terrain and physics variations inside a clear operational envelope.

Primary objective:

> Demonstrate that targeted failure discovery plus retraining improves Go2 locomotion robustness more efficiently than broad random domain randomization alone.

### Candidate Open-Source Starting Points

1. Isaac Lab built-in Unitree Go2 assets and locomotion tasks.
2. Unitree's `unitree_rl_lab`, which provides reinforcement learning environments for Unitree robots on top of Isaac Lab. Source: [unitreerobotics/unitree_rl_lab](https://github.com/unitreerobotics/unitree_rl_lab).
3. RSL-RL or rl-games policies for legged locomotion, depending on which is most compatible with the chosen Isaac Lab task.

### MVP Inputs

1. Policy artifact: PyTorch checkpoint or ONNX export.
2. Robot description: Unitree Go2 USD or URDF for Isaac Lab, MJCF translation for MuJoCo/MJX.
3. Task definition: velocity tracking or rough-terrain traversal.
4. Operational envelope: terrain, speed, slope, friction, payload, and actuator limits that are plausible for the intended deployment.
5. Failure predicates: deterministic rules that label falls, slips, stalls, collisions, and tracking loss.

### MVP Outputs

1. Failure cluster map with top failure modes.
2. Example rollout videos for each cluster.
3. Risk-ranked cluster table.
4. Curriculum distributions around high-risk clusters.
5. RLDS-compatible or RLDS-ready dataset export.
6. Retraining comparison:
   - baseline policy on nominal test set
   - baseline policy on discovered failure holdout set
   - retrained policy on nominal test set
   - retrained policy on discovered failure holdout set
7. Deployment readiness report with residual risks and recommended next experiments.

## System Architecture

BreakPoint can be decomposed into nine services or modules.

### 1. Policy Adapter

The policy adapter provides a common inference interface over customer policies.

Responsibilities:

1. Load policy artifacts from PyTorch, ONNX, JAX, or framework-specific checkpoints.
2. Normalize observations into the policy's expected format.
3. Denormalize actions into simulator commands.
4. Enforce action bounds and rate limits.
5. Record policy metadata:
   - architecture family
   - observation space
   - action space
   - training distribution assumptions
   - normalization stats
   - recurrent state requirements

MVP adapter:

1. PyTorch policy running in-process with Isaac Lab.
2. Optional ONNX export for easier sim-to-sim validation.

### 2. Environment Parameter Schema

BreakPoint needs a canonical parameter vector that can be translated into each simulator.

Example categories for Go2 locomotion:

```yaml
terrain:
  slope_deg: [-20, 20]
  step_height_m: [0.00, 0.35]
  gap_width_m: [0.00, 0.45]
  roughness_amp_m: [0.00, 0.18]
  obstacle_density: [0.00, 0.35]
contact:
  ground_friction: [0.20, 1.40]
  restitution: [0.00, 0.20]
  compliance: [0.00, 0.10]
robot:
  payload_kg: [0.00, 3.00]
  mass_scale: [0.90, 1.10]
  motor_strength_scale: [0.70, 1.10]
  actuator_delay_ms: [0, 80]
sensing:
  imu_bias_scale: [0.00, 1.00]
  encoder_noise_scale: [0.00, 1.00]
episode:
  commanded_velocity_mps: [0.20, 1.80]
  initial_yaw_error_deg: [-20, 20]
```

Every parameter must include:

1. Name.
2. Unit.
3. Type.
4. Range.
5. Operational plausibility tag.
6. Simulator support matrix.
7. Default value.
8. Translation function per simulator.

### 3. Simulator Worker Pool

The simulator pool executes environment batches and returns episode records.

Primary MVP backend:

1. Isaac Lab for high-throughput search and first-pass failure detection.

Secondary MVP backend:

1. MuJoCo/MJX for cross-simulator confirmation of selected clusters, if asset translation and policy I/O are tractable.

Experimental later backend:

1. Genesis for broader physics diversity once the specific embodiment and task are stable.

Worker responsibilities:

1. Materialize the parameter vector into simulator config.
2. Run deterministic seeds where possible.
3. Execute policy rollout for a fixed horizon or until terminal failure.
4. Log state, actions, contacts, rewards, observations, and failure predicates.
5. Emit compact episode summaries for every rollout.
6. Persist full trajectories and videos only for failures, boundary cases, and calibration samples.

### 4. Failure Predicate Engine

The failure predicate engine turns raw rollouts into structured labels.

Candidate locomotion predicates:

1. Fall: base height below threshold or roll/pitch beyond threshold for N consecutive steps.
2. Slip: foot tangential velocity above threshold while contact force is high.
3. Stumble: base angular velocity spike plus recovery failure.
4. Stall: commanded velocity tracking error above threshold for N seconds.
5. Collision: non-foot body contact with terrain or obstacle.
6. Energy anomaly: torque or power exceeds safe operating budget.
7. Recovery failure: policy cannot return to stable gait after a disturbance.

Each failure event should store:

```yaml
failure_event:
  event_id: string
  episode_id: string
  predicate: fall | slip | stall | collision | energy_anomaly | recovery_failure
  severity: float
  first_trigger_time_s: float
  terminal: boolean
  evidence:
    state_keys: [base_height, roll, pitch, contact_forces]
    video_uri: optional string
```

### 5. Search Engine

The search engine proposes new environment parameter vectors.

Recommended search strategy:

1. Start with Sobol or Latin Hypercube samples to cover the operational envelope.
2. Fit a surrogate model that predicts failure probability and severity from the parameter vector.
3. Use batch Bayesian optimization to propose promising failure candidates.
4. Add novelty search so the optimizer does not collapse onto one failure mode.
5. Run boundary-focused sampling around the 30 percent to 70 percent success region to map failure transitions.
6. Reserve held-out random samples to estimate whether search overfit the surrogate.

Bayesian optimization is appropriate because policy evaluation is a black-box function of simulator parameters, and the goal is to choose informative evaluations under compute budget. BoTorch describes the core problem as maximizing an expensive black-box function. Source: [BoTorch overview](https://botorch.org/docs/overview).

For BreakPoint, the objective should be multi-objective:

```text
score(x) =
  w_failure * predicted_failure_probability(x)
+ w_severity * predicted_failure_severity(x)
+ w_novelty * distance_to_existing_failure_clusters(x)
+ w_plausibility * operational_plausibility(x)
- w_artifact * predicted_simulator_artifact_risk(x)
```

The MVP can start with a simpler score:

```text
score(x) = p(failure | x) * severity(x) + novelty_bonus(x)
```

### 6. LLM Guidance Layer

The LLM layer should guide search, not replace measurement.

Safe LLM uses:

1. Read policy metadata, training configs, reward terms, and environment ranges.
2. Propose likely failure hypotheses:
   - high slope plus low friction
   - step height near gait clearance
   - actuator delay plus high commanded velocity
   - payload shift plus yaw correction
3. Suggest parameter interactions to seed the first search batch.
4. Generate human-readable cluster explanations.
5. Draft curriculum labels and stage descriptions.

Unsafe LLM uses to avoid:

1. Deciding whether a rollout passed or failed.
2. Inventing risk scores without simulator evidence.
3. Claiming real-world safety.
4. Directly editing policy weights without a controlled training pipeline.
5. Expanding the operational envelope beyond customer-approved bounds.

### 7. Failure Clusterer

The clusterer groups failed episodes into failure modes.

Feature set:

1. Normalized environment parameter vector.
2. Failure predicate type.
3. Failure time.
4. Severity.
5. Trajectory embedding:
   - base pose sequence
   - foot contact sequence
   - velocity tracking error
   - action/torque sequence
6. Simulator backend and seed.

Algorithms:

1. Start with HDBSCAN or DBSCAN for density-based clusters with outlier support.
2. Use PCA or UMAP only for visualization, not as the sole clustering basis.
3. Compute cluster summaries:
   - centroid and parameter ranges
   - dominant failure predicate
   - severity distribution
   - representative episode
   - nearest success boundary
   - coverage count

Cluster output:

```yaml
failure_cluster:
  cluster_id: string
  label: "low-friction diagonal step-down fall"
  dominant_predicate: fall
  episodes: 183
  severity_p50: 0.72
  severity_p95: 0.94
  parameter_signature:
    ground_friction: [0.20, 0.36]
    step_height_m: [0.18, 0.29]
    commanded_velocity_mps: [1.25, 1.80]
  nearest_success_boundary:
    ground_friction_delta: 0.08
    step_height_delta_m: -0.04
  representative_episode_uri: string
```

### 8. Sim-To-Real Risk Scorer

The risk scorer estimates whether a failure cluster should be prioritized for retraining.

It should combine:

1. Cross-simulator agreement.
2. Failure severity.
3. Operational plausibility.
4. Distance from training distribution.
5. Cluster support count.
6. Sensitivity to simulator-only parameters.
7. Real-world calibration evidence, when available.

Suggested MVP scoring:

```text
risk_score =
  0.30 * simulator_agreement
+ 0.25 * severity
+ 0.20 * operational_plausibility
+ 0.15 * cluster_support_confidence
+ 0.10 * boundary_stability
```

Risk tiers:

1. High: reproduced in most configured simulators, severe, plausible, stable under seed changes.
2. Medium: reproduced in some simulators or sensitive to physics model, but plausible enough to test or retrain.
3. Low: isolated to one simulator, low severity, outside operational envelope, or likely translation artifact.
4. Needs calibration: important cluster with insufficient simulator or real-world evidence.

The draft's "3/3 high, 2/3 medium, 1/3 low" rule is useful for a demo, but production scoring should be weighted. Simulator count alone ignores severity, plausibility, and model confidence.

### 9. Curriculum And Dataset Generator

The generator turns high-value clusters into training environments.

Curriculum DAG stages:

1. Boundary warmup: near-success variants just inside the failure boundary.
2. Core failure: high-risk cluster variants centered on observed failures.
3. Recovery: variants that force the policy to regain stable gait after perturbation.
4. Bridge: mixed variants between adjacent clusters.
5. Held-out evaluation: variants generated from the same cluster family but never used for training.
6. Nominal guardrail: normal environments used to detect regression.

Sampling weights:

```text
stage_weight =
  0.35 * risk_score
+ 0.25 * failure_severity
+ 0.20 * coverage_gap
+ 0.10 * cluster_novelty
+ 0.10 * customer_priority
```

Dataset metadata should include:

```yaml
episode_metadata:
  source: breakpoint
  policy_under_test: string
  policy_version: string
  simulator: isaac_lab | mjx | genesis
  environment_params: object
  failure_cluster_id: optional string
  curriculum_stage_id: optional string
  risk_score: optional float
  split: train | validation | heldout_failure | nominal_guardrail
  generation_seed: int
```

Export paths:

1. Native simulator configs for retraining in Isaac Lab.
2. Parquet or JSONL metadata for analysis.
3. RLDS-ready episodes for imitation/offline RL workflows.
4. Optional LeRobot-compatible conversion later.

## End-To-End Workflow

The product workflow should read as a disciplined engineering loop.

1. Connect policy.
   - Customer uploads or points to a policy artifact, robot model, and task definition.
   - BreakPoint validates observation/action compatibility.

2. Define operational envelope.
   - Customer chooses parameter ranges and safety constraints.
   - BreakPoint flags unsupported or physically implausible ranges.

3. Run initial sweep.
   - Isaac Lab workers execute 10,000 to 50,000 variations.
   - The search engine balances broad coverage and failure-seeking proposals.

4. Detect and cluster failures.
   - Predicates label failures.
   - Clusterer groups failures into modes.
   - Dashboard shows the top clusters.

5. Cross-check risk.
   - Selected cluster centroids and boundary samples are replayed in MJX or another backend.
   - Scorer assigns high, medium, low, or needs-calibration tiers.

6. Generate curriculum.
   - High and medium clusters become curriculum stages.
   - Low-risk likely artifacts are reported but excluded from default retraining.

7. Retrain or export.
   - MVP can run a simple retraining loop in Isaac Lab.
   - Enterprise product can export datasets and configs to the customer's training stack.

8. Re-test.
   - BreakPoint reruns discovery on the improved policy.
   - Report compares boundary movement, residual failures, and nominal regression.

## MVP Implementation Plan

### Phase 0: Website And Demo Narrative

Goal: build the public-facing website only. Do not build the robotics MVP.

Deliverables:

1. Static landing page for Inoki Labs and BreakPoint.
2. Mock product visuals:
   - failure map
   - policy rollout comparison
   - risk score table
   - curriculum DAG
3. Clear MVP explanation centered on Unitree Go2 failure discovery.
4. Marketing language that avoids unverified claims.

### Phase 1: Simulation Harness

Goal: run a known Go2 locomotion policy across parameterized Isaac Lab environments.

Deliverables:

1. Isaac Lab project scaffold.
2. Go2 policy adapter.
3. Parameter schema for rough terrain and basic dynamics randomization.
4. Episode runner with seed control.
5. Failure predicate labels.
6. Summary logs and sample videos.

Success criteria:

1. Run at least 10,000 episodes unattended.
2. Produce deterministic replay for representative failures.
3. Record enough metadata to reproduce any episode.

### Phase 2: Failure Search And Clustering

Goal: find failures faster than naive random search and group them into modes.

Deliverables:

1. Sobol or Latin Hypercube initial sampler.
2. Batch Bayesian optimization or tree-structured Parzen estimator baseline.
3. Novelty bonus to diversify discovered failures.
4. HDBSCAN or DBSCAN clusterer.
5. Cluster summary report.

Success criteria:

1. At least 3 distinct failure clusters on the Go2 task.
2. Time-to-first-failure and unique-clusters-per-10k episodes beat random search baseline.
3. Cluster labels are interpretable from parameter signatures and rollout evidence.

### Phase 3: Cross-Simulator Validation

Goal: replay selected clusters in a second simulator.

Deliverables:

1. Minimal Go2 asset translation path into MuJoCo/MJX.
2. Policy inference compatibility layer.
3. Replay scripts for cluster centroids and boundary samples.
4. Cross-sim scorecard.

Success criteria:

1. At least 10 high-priority cluster configurations replay in both Isaac Lab and MJX.
2. Report clearly marks translation mismatches and unsupported parameters.
3. Risk score separates simulator-consistent failures from likely artifacts.

### Phase 4: Curriculum Generation And Retraining

Goal: prove that BreakPoint-generated data improves robustness.

Deliverables:

1. Variant generator around each high-risk cluster.
2. Curriculum stage DAG.
3. Training config that mixes nominal, boundary, and failure-cluster samples.
4. Held-out failure evaluation set.
5. Before/after robustness report.

Success criteria:

1. Improved success rate on held-out failure variants.
2. No significant regression on nominal environment set.
3. Reduced failure severity or shifted failure boundary on repeat discovery.

### Phase 5: Product Dashboard

Goal: make the workflow understandable to robot teams.

Deliverables:

1. Run overview.
2. Failure map.
3. Cluster detail page.
4. Simulator agreement matrix.
5. Curriculum builder.
6. Report export.

Success criteria:

1. A robotics engineer can identify the top 3 actionable failures in under 2 minutes.
2. Every failure cluster has evidence, parameters, risk tier, and next action.
3. Reports are useful without access to the raw simulator.

## Metrics

### Discovery Metrics

1. Time to first failure.
2. Unique failure clusters per 10,000 episodes.
3. Failure diversity score.
4. Boundary precision: how tightly the system estimates success/failure transition zones.
5. Search lift over random sampling.

### Risk Metrics

1. Cross-simulator agreement rate.
2. Seed stability.
3. Severity distribution.
4. Operational plausibility.
5. Simulator artifact likelihood.
6. Confidence interval around risk score.

### Retraining Metrics

1. Success rate on discovered failure holdout set.
2. Success rate on nominal guardrail set.
3. Mean time to failure.
4. Velocity tracking error.
5. Fall rate.
6. Slip rate.
7. Energy or torque budget.
8. Boundary movement after retraining.

### Business Metrics

1. Hours of manual testing replaced.
2. Number of actionable failure modes found per compute dollar.
3. Retraining lift per generated environment.
4. Customer time from policy upload to report.
5. Repeat usage per policy version.

## Data Storage Plan

Store all episode summaries. Store full trajectories selectively.

Recommended storage:

1. Metadata: Parquet or DuckDB for local MVP, Postgres for service backend.
2. Full trajectories: Zarr, HDF5, or TFRecord depending on pipeline.
3. Videos: object storage, only for representative failures and sampled successes.
4. Reports: static HTML and PDF exports.
5. Dataset exports: RLDS-compatible TFRecords or conversion-ready intermediate format.

Episode summary fields:

```yaml
episode:
  episode_id: string
  run_id: string
  policy_id: string
  simulator: string
  seed: int
  params_hash: string
  params: object
  success: boolean
  failure_predicates: [string]
  severity: float
  duration_s: float
  reward_total: float
  tracking_error_mean: float
  energy_total: float
  cluster_id: optional string
  artifact_flags: [string]
  created_at: timestamp
```

## Compute Plan

MVP compute should start modestly and benchmark real throughput before making public claims.

Local development:

1. One high-end NVIDIA GPU workstation.
2. Isaac Lab headless mode.
3. Reduced visual rendering unless perception is part of the policy.
4. Store videos only for selected episodes.

Scale-up path:

1. Multi-GPU Isaac Lab or Ray-based worker scheduling.
2. Cloud GPUs for burst searches.
3. Queue-based execution with resumable runs.
4. Separate search controller from simulator workers.

Do not promise "50,000 variations per hour" until measured on a specific policy, episode horizon, number of parallel environments, and GPU class.

## Safety And Trust Boundaries

BreakPoint should produce better evidence, not safety theater.

Required guardrails:

1. Every report must show simulator version, policy version, seed strategy, and parameter envelope.
2. Every risk score must state whether real-world calibration was used.
3. Low-risk simulator artifacts should remain visible, not silently discarded.
4. Any LLM-authored explanation must be traceable to measured rollout data.
5. Generated retraining data should include held-out sets to detect overfitting.
6. Customer policies and robot assets must be treated as confidential IP.

## Risks And Mitigations

### Risk: Simulator Artifacts Look Like Real Failures

Mitigation:

1. Cross-simulator validation.
2. Seed stability checks.
3. Physics parameter sensitivity analysis.
4. Explicit artifact flags.
5. Real-world calibration later.

### Risk: Search Finds Impressive But Irrelevant Edge Cases

Mitigation:

1. Require customer-approved operational envelopes.
2. Add operational plausibility to the score.
3. Report distance from the training and deployment distributions.
4. Separate "possible" from "priority" failures.

### Risk: Retraining Overfits To Discovered Clusters

Mitigation:

1. Use held-out variants.
2. Keep nominal guardrail evaluation.
3. Generate bridge cases between clusters.
4. Track boundary movement, not just memorized scenario pass rates.

### Risk: LLM Produces Convincing But Wrong Explanations

Mitigation:

1. LLM suggestions must cite measured parameters and rollout evidence.
2. Use structured prompts with constrained outputs.
3. Keep deterministic failure predicates as source of truth.
4. Flag explanations as generated analysis, not measurement.

### Risk: Cross-Simulator Translation Becomes The Hardest Part

Mitigation:

1. Start with a small parameter subset that both simulators support.
2. Create explicit translation tests.
3. Track unsupported parameters per backend.
4. Avoid claiming agreement when the scenario was materially changed.

### Risk: Existing Products Occupy The Validation Layer

Mitigation:

1. Differentiate on retraining data generation and curriculum DAGs.
2. Build failure-cluster libraries over time.
3. Integrate with evaluation tools rather than competing with all of them.
4. Avoid naming or messaging that overlaps with RoboGate.

## Competitive Positioning

### Isaac Lab And Isaac Lab-Arena

Isaac Lab is the simulation and training foundation. Isaac Lab-Arena is a scalable evaluation framework. BreakPoint should build on these ideas rather than pretend to replace them.

BreakPoint differentiation:

1. Failure-seeking search instead of broad benchmark execution.
2. Failure clustering and risk ranking.
3. Cross-simulator artifact analysis.
4. Curriculum and retraining data export.
5. Run-to-run measurement of failure-boundary movement.

### RoboGate

RoboGate is the closest adjacent product concept discovered in research. It focuses on pre-deployment validation, confidence scores, and a failure dataset.

BreakPoint differentiation:

1. Stronger emphasis on targeted retraining data.
2. Simulator agreement as a risk-scoring input.
3. Curriculum DAG generation.
4. Failure library as a reusable data engine, not only a validation verdict.

### Domain Randomization

Domain randomization is a training method. BreakPoint can use domain randomization but should improve its efficiency.

BreakPoint differentiation:

1. It searches for the failure boundary first.
2. It spends retraining budget around measured weaknesses.
3. It ranks which randomized dimensions matter most.

### Human Demonstration Data Vendors

Human demonstration data is valuable, especially for manipulation. BreakPoint is complementary because it generates adversarial and recovery data that humans may not naturally demonstrate.

## Business Strategy

### Ideal Early Customers

1. Quadruped teams deploying in warehouses, inspection, defense, construction, agriculture, or outdoor industrial sites.
2. Humanoid teams validating locomotion and mobile manipulation policies.
3. AMR companies with learned navigation or recovery policies.
4. Manipulation teams moving from benchmark success to industrial deployment.
5. Robotics AI infrastructure teams that already use Isaac Sim, Isaac Lab, MuJoCo, or internal simulators.

### Buyer Personas

1. Head of autonomy: wants fewer field failures and faster policy iteration.
2. Simulation lead: wants automated scenario generation and better coverage.
3. Safety/reliability lead: wants evidence before deployment.
4. ML engineer: wants retraining data that fixes specific weaknesses.
5. Founder/CTO: wants a demo that shows robustness improvement with less hardware risk.

### Initial Offer

BreakPoint Pilot:

1. Customer provides a policy, robot model, and target task.
2. Inoki runs a fixed-compute failure discovery job.
3. Customer receives a failure report, videos, risk-ranked clusters, and retraining dataset.
4. Optional add-on: retrain and compare boundary movement.

### Moat

The defensible asset is the failure-mode library:

1. Every run creates structured parameter-failure data.
2. Clusters can transfer across policies, robots, and customer domains.
3. The library improves search priors and risk scoring over time.
4. Customers benefit from cumulative knowledge while their raw policy and asset IP remain private.

## Naming And Messaging

Recommended product name: BreakPoint.

Short description:

> BreakPoint is an adversarial simulation engine that finds robot policy failure modes and turns them into targeted retraining data.

Website headline options:

1. Find the edge cases before the robot does.
2. Break robot policies in simulation. Fix them before deployment.
3. The failure-discovery engine for physical AI.
4. Turn simulation failures into retraining data.

Avoid:

1. "Guaranteed safety."
2. "Proves sim-to-real."
3. "Eliminates field testing."
4. Any unverified Figure AI cost claim.
5. "RoboGate" as a product term.

## Open Questions

1. Which exact Go2 policy should be used for the first demo?
2. Is the first public demo locomotion-only, or should manipulation be included as a second visual story?
3. Should the MVP run retraining itself or only export curriculum data?
4. Which second simulator is most practical for Go2: MuJoCo/MJX or Genesis?
5. Will the website collect emails, pilot requests, or simply introduce the concept?
6. What level of founder/company identity should the website show beyond the product?

## Frontend And Website Design

The website should introduce Inoki Labs and BreakPoint as a high-tech robotics AI startup. It should be a real product site, not a generic landing page. The first screen must make the product obvious: this company finds and fixes robot policy edge cases.

### Design Direction

Use a "monochrome blueprint / pearl-tech" aesthetic inspired by the high-level qualities of the Counter-Strike Printstream finish: stark black and white composition, glossy pearlescent highlights, precision technical marks, and a clean engineered surface. Do not copy Counter-Strike branding, weapon-skin symbols, creator marks, or exact decals. Treat Printstream as an art-direction reference, not an asset source.

Core visual principles:

1. Monochrome first: pearl white, ceramic white, graphite black, ink black, cool gray, and faint silver.
2. Blueprint structure: thin rule lines, orthographic robot diagrams, terrain cross-sections, coordinate grids, dimension ticks, parameter labels, and schematic callouts.
3. Pearlescent restraint: very subtle iridescent sheen on borders, hover states, hero highlights, and selected data paths. It should shift between white, silver, faint cyan, and faint magenta only under motion or interaction.
4. High-tech cleanliness: large quiet surfaces, sharp alignment, precise spacing, and no decorative noise that does not support the robotics/testing concept.
5. Product evidence over ornament: the hero, charts, and panels should look like simulation instrumentation and engineering drawings, not generic AI art.
6. Status color discipline: use amber, muted red, and green only inside data states like warning, failure, and verified recovery. The overall website should still read as monochrome.

Avoid a one-note blue/purple AI gradient. Avoid soft blobs, bokeh, glassmorphism for its own sake, and sci-fi decoration that could belong to any AI startup. The product is robotics reliability, so the visual language should feel precise, physical, and operational.

### Visual System

The site should feel like a premium lab instrument crossed with a robotics blueprint.

Palette:

```text
ink-black:     #050505
graphite:      #111214
carbon-gray:   #2a2c30
blueprint-line:#d8dde5
pearl-white:   #f4f2ec
ceramic-white: #fffdf7
silver:        #bfc3c9
failure-red:   #d34b4b
warning-amber: #d8a034
verified-green:#7fae7a
```

Surface treatment:

1. Use pearl-white sections with black blueprint linework for strategic explanations.
2. Use graphite/black sections with white wireframe overlays for product telemetry.
3. Add thin iridescent borders only on active panels, selected cluster paths, and CTA hover states.
4. Use subtle brushed-metal or halftone texture at very low opacity to keep large monochrome areas from feeling flat.
5. Keep borders mostly 1px, squared or lightly rounded at 4px to 6px.
6. Avoid heavy shadows; depth should come from layered linework, contrast, and small specular highlights.

Blueprint motifs:

1. Orthographic Unitree Go2-style quadruped silhouette with labeled joints and contact points.
2. Terrain slices with slope, step height, roughness amplitude, and friction annotations.
3. Failure-boundary isolines drawn like contour lines on engineering paper.
4. Parameter axes with tick marks and small monospace numeric labels.
5. "Exploded view" panels that break a failure cluster into terrain, robot state, contact event, and retraining response.
6. Small registration marks, crop marks, and calibration squares around charts, but never enough to compete with content.

### First Viewport

The hero should be full-bleed and product-specific.

Hero concept:

1. Background: a monochrome simulation-blueprint composition showing a quadruped crossing rough terrain. Use white/graphite linework, topographic contours, joint markers, and failure-boundary traces.
2. Material accent: a faint pearlescent sweep should pass across the robot outline and selected failure path as the page loads, similar to light moving across a glossy white technical surface.
3. Foreground: large product name "BreakPoint" with a short literal headline.
4. Supporting line: "Adversarial simulation that finds robot policy failures and turns them into retraining data."
5. Primary CTA: "Request a pilot."
6. Secondary CTA: "View the MVP plan."
7. Visible bottom hint: the next section should peek into view with a compact workflow strip.

Do not place the hero text in a card. Do not use decorative abstract blobs. The primary visual must show a robot policy under test, not generic AI imagery.

### Page Structure

1. Hero: product name, core promise, robotics simulation visual.
2. Problem band: "Average success hides tail failure." Show three concise examples: low friction, step transition, actuator delay.
3. Workflow band: Search -> Cluster -> Score -> Generate -> Retrain -> Re-test.
4. Product proof mock: interactive-looking failure map with clusters and risk tiers.
5. Sim-to-real section: agreement matrix across Isaac Lab, MJX, and Genesis, with careful language about risk scoring.
6. Curriculum section: DAG visualization from easy boundary cases to hard bridge cases.
7. MVP section: Unitree Go2 demo plan, metrics, and expected before/after comparison.
8. Platform section: integrations with Isaac Lab, MuJoCo/MJX, RLDS-ready export, and policy adapters.
9. Company section: Inoki Labs mission, focused on physical AI reliability.
10. CTA section: pilot request, with fields for robot type, simulator stack, policy format, and target task.

### Visual Components

Use product-native visuals:

1. Failure heatmap over parameter axes, rendered as monochrome contour lines with selective red/amber marks for actual failures.
2. Cluster cards for individual failure modes, but do not nest cards inside cards.
3. Simulator agreement matrix styled like a lab calibration sheet.
4. Curriculum DAG drawn as blueprint node wiring, with stage numbers and small dimensional labels.
5. Before/after robustness chart using black/white linework and a subtle pearlescent highlight on the improved boundary.
6. Terminal-style run log for the demo:

```text
breakpoint run go2-rough-terrain --budget 10000
[search] 10,000 variants evaluated
[cluster] 7 failure modes found
[risk] 3 high-priority clusters
[export] 30,000 targeted curriculum episodes
```

The terminal should look like an instrument panel, not a decorative code block.

Additional art direction:

1. Buttons should feel like precision controls: flat monochrome, crisp labels, thin borders, and a pearlescent edge on hover.
2. Icons should be simple line icons that match the blueprint stroke weight.
3. Product panels should use technical labels like `cluster_03`, `friction=0.28`, and `risk=high`, but avoid filling the page with fake terminal clutter.
4. The hero visual can be a generated bitmap, but UI diagrams should be implemented with HTML/CSS/SVG/canvas so they remain crisp and responsive.

### Typography

Use a technical but distinctive pairing:

1. Display: a condensed industrial sans or engineered grotesk for headings.
2. Body: a highly readable sans with strong numerals.
3. Data labels: a compact mono font for metrics and parameters.

Keep headings sharp and compact. Avoid oversized marketing text inside dense product panels.

### Motion

Motion should communicate analysis and make the page feel smoothly engineered:

1. Enable smooth anchor scrolling for section navigation.
2. Use scroll-linked section reveals where blueprint lines draw in before text settles into place.
3. Hero heatmap slowly scans across terrain.
4. A pearlescent light sweep crosses the hero robot outline once on load, then stops.
5. Failure points accumulate during scroll.
6. Cluster boundaries draw in as the workflow section enters view.
7. Risk scores tick from unknown to low/medium/high after simulator replay.
8. Curriculum DAG nodes activate in stage order.
9. Use subtle parallax between the blueprint grid, robot silhouette, and data traces, with very small movement ranges so it feels premium instead of gimmicky.

Respect `prefers-reduced-motion` and keep all information available without animation.

Implementation notes for smoothness:

1. Prefer native `scroll-behavior: smooth` for anchor jumps.
2. Use transform and opacity animations, not layout-changing properties.
3. Keep scroll effects deterministic and sparse; one strong reveal per section is better than constant movement.
4. If using a scroll library, choose it only for inertial smoothness and section progress, not excessive animation.
5. Keep animation durations around 400ms to 900ms, with calm easing such as `cubic-bezier(0.16, 1, 0.3, 1)`.

### Interaction

The website can be static but should feel product-like:

1. Tabs for "Failure Discovery", "Risk Scoring", and "Curriculum Export".
2. Hover tooltips on risk-score components.
3. Segmented control for simulator backends.
4. Compact filter controls for failure type and severity.
5. CTA form that is short and specific.

### Copy Tone

Use clear engineering language:

1. "Find failure boundaries."
2. "Replay across simulators."
3. "Generate targeted retraining data."
4. "Measure boundary movement after retraining."

Avoid vague AI language:

1. "Revolutionary intelligence."
2. "Autonomous magic."
3. "Solves robotics."
4. "Guaranteed deployment safety."

### Accessibility And Performance

1. Maintain high contrast in dark mode.
2. Do not encode risk by color alone; use labels and icons.
3. Keep charts keyboard-readable through tables or accessible summaries.
4. Use real images or generated bitmap assets with descriptive alt text.
5. Lazy-load heavy media below the fold.
6. Avoid canvas-only critical text.
7. Ensure mobile layout keeps charts readable through horizontal scrolling or simplified stacked views.

### Website Build Constraint

For the immediate site, implement only the frontend and mocked product visuals. Do not build the simulator, AI search, LLM guidance, retraining loop, or policy adapters.

The website should sell the product vision and MVP plan honestly:

> BreakPoint is being built to find and fix the long-tail failures that decide whether robot policies survive deployment.
