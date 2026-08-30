export interface PresetDocument {
  id: string;
  title: string;
  category: string;
  type: "text" | "pdf" | "image";
  description: string;
  content: string;
}

export const SAMPLE_PRESETS: PresetDocument[] = [
  {
    id: "ai-systems-benchmark",
    title: "AI Systems Evaluation & Technology Benchmark Report",
    category: "AI & Systems Evaluation",
    type: "text",
    description: "A multi-faceted evaluation brief containing landmark public benchmarks, factually contradicted assumptions, internal support benchmarks, and sweeping predictive claims.",
    content: `# AI Systems Evaluation & Technology Benchmark Report
Document: Showcase Technical Brief
Date: March 2025
Author: Cognitive Systems Evaluation Directorate

## Section 1: Baseline Architecture & Precedents
Claims for Analysis:
- Claim A — Publicly verifiable: The original ImageNet dataset contains more than one million images organized into 1,000 object categories.
- Claim B — Publicly verifiable: The Transformer architecture was introduced in the 2017 research paper Attention Is All You Need.
- Claim C — Factually inaccurate / Contradicted: Large language models can only understand text and cannot process images.

## Section 2: Internal Evaluation & Operational Metrics
- Claim D — Internal benchmark / Unverified: In our internal test of 120 customer-support messages, the prototype achieved 96.7% intent-classification accuracy.
- Claim E — Internal benchmark: The prototype reduced average response time from 18 seconds to 4 seconds, representing a 77.8% reduction.
- Claim F — Predictive / Exaggerated: By 2026, every major enterprise software platform has replaced traditional rule-based automation with autonomous AI agents.
`,
  },
  {
    id: "solid-state-battery",
    title: "QuantumVolt Solid-State Battery Commercialization Whitepaper",
    category: "Clean Tech & Energy",
    type: "text",
    description: "An ambitious technical announcement claiming a 1,200 Wh/kg energy density battery with 3-minute ultra-fast charging by Q3 2025.",
    content: `# QuantumVolt Technical Announcement: Commercial Solid-State Battery Breakthrough
Date: November 14, 2024
Author: Dr. Marcus Vance, Chief Technology Officer, QuantumVolt Energy Labs

## Executive Overview
QuantumVolt Energy Labs is proud to announce the final qualification of our proprietary solid-electrolyte lithium-metal cell, code-named "TitanCell Gen-4". Through the deployment of a ceramic-polymer nanolayer matrix, QuantumVolt has bypassed traditional dendritic degradation mechanisms entirely.

## Key Technical Specifications & Claims
1. **Volumetric & Gravimetric Energy Density**: TitanCell Gen-4 achieves a certified gravimetric energy density of 1,240 Wh/kg and a volumetric density of 2,150 Wh/L at room temperature (25°C).
2. **Charging Kinetics**: The cell sustains continuous 20C charging rates, accomplishing a 0% to 90% State of Charge (SoC) in exactly 180 seconds (3 minutes) without thermal runaway risks or active cooling loops.
3. **Cycle Life & Degradation**: Internal benchmark cycling demonstrates 99.4% capacity retention after 8,500 continuous 10C charge-discharge cycles.
4. **Manufacturing Scalability & Cost**: QuantumVolt has completed a 50 GWh pilot manufacturing line in Leipzig, Germany, yielding cost-per-kWh metrics under $38/kWh—undercutting conventional LFP and NMC batteries by over 55%.
5. **Regulatory & OEM Partnerships**: QuantumVolt has finalized binding multi-year supply contracts with three tier-1 European automotive conglomerates for commercial vehicle deployment starting Q3 2025.

## Intellectual Property & Testing
All measurements were validated using standard ASTM-E1447 protocols under internal laboratory supervision. Independent third-party validation by the Fraunhofer Institute is scheduled for completion in late 2026.
`,
  },
  {
    id: "ai-supercomputing-chip",
    title: "AuraCore 9000 AI Accelerator Performance Benchmark Brief",
    category: "Semiconductors & AI",
    type: "text",
    description: "A hardware vendor report claiming 12x compute efficiency over NVIDIA Blackwell architecture while utilizing standard PCIe Gen5 interfaces.",
    content: `# AuraCore Technologies: AuraCore 9000 Microarchitecture & MLPerf Preview
Published: January 2025
Lead Architect: Elena Rostova, VP Silicon Engineering

## 1. Microarchitectural Innovation
AuraCore 9000 introduces the world's first Optical-Digital Hybrid Tensor Core (OD-HTC) fabricated on TSMC's 2nm (N2P) node. By routing matrix-multiplication operations through integrated on-die photonic wave-guides, AuraCore eliminates over 85% of capacitive electrical resistance.

## 2. Performance Assertions & Comparative Benchmarks
- **FP8 Inference Throughput**: AuraCore 9000 achieves 28.4 PFLOPS of dense FP8 compute per single-slot 300W PCIe card, representing a 12.4x throughput gain over NVIDIA B200 accelerators.
- **Memory Bandwidth**: Equipped with 288GB of custom HBM4e operating at an unprecedented 18.2 TB/s bandwidth.
- **Power Efficiency**: The architecture operates at 94.7 TFLOPS/Watt, reducing datacenter TCO by 73% compared to conventional GPU clusters.
- **Software Compatibility**: Fully transparent drop-in compatibility with PyTorch 2.5 and Triton with zero kernel recompilation required.

## 3. Production & Availability
Volume production has commenced across TSMC Fab 20 with over 250,000 units already shipped to top tier cloud service providers (CSPs) across North America and Asia-Pacific.
`,
  },
  {
    id: "biopharma-trial",
    title: "NeuroVive Phase III Clinical Results for Alzheimer's Candidate NV-412",
    category: "Biotechnology & Healthcare",
    type: "text",
    description: "A pharmaceutical press release claiming complete reversal of cognitive decline in 78% of mild-to-moderate patients with zero ARIA side effects.",
    content: `# NeuroVive Therapeutics Announces Landmark Phase 3 CLARITY-AD Trial Results for NV-412
Date: October 2024 | Location: Boston, MA & Basel, Switzerland

## Highlights
NeuroVive Therapeutics Inc. (NASDAQ: NVVE) today announced top-line results from its international Phase 3 randomized, double-blind, placebo-controlled trial evaluating NV-412 (synaptotrophic micro-peptide) in 2,400 patients with early-to-moderate Alzheimer's disease.

## Primary & Secondary Endpoints
1. **Cognitive Reversal**: Patients in the 40mg bi-weekly cohort demonstrated a statistically significant 5.8-point improvement on the ADAS-Cog13 score at Week 48 (p < 0.0001), indicating cognitive function restoration rather than merely slowed decline.
2. **Biomarker Clearance**: Plasma p-tau217 levels decreased by 84% compared to placebo at 24 weeks.
3. **Safety & Tolerability**: Unlike existing monoclonal antibodies targeting amyloid beta, NV-412 reported zero incidences of Amyloid-Related Imaging Abnormalities (ARIA-E or ARIA-H) across all 2,400 enrolled participants.
4. **FDA Breakthrough & Commercialization Timeline**: NeuroVive has submitted an accelerated BLA (Biologics License Application) with an anticipated PDUFA decision date in April 2025.
`,
  },
  {
    id: "ml-model-accuracy",
    title: "CardioPredict ML Classifier Performance Evaluation Brief",
    category: "Machine Learning & AI",
    type: "text",
    description: "An internal machine learning evaluation report detailing classification accuracy, precision, and confusion matrix results on clinical test splits.",
    content: `# CardioPredict Machine Learning Model Evaluation Report
Date: February 2025
Author: AI Diagnostic Research Team

## Model Architecture & Training Setup
We evaluated an ensemble of Random Forest and Gradient Boosted Decision Trees trained on standardized cardiovascular diagnostic features. The validation split contained 14 held-out patient validation records.

## Key Evaluation Findings & Accuracy Claims
1. **Classification Accuracy**: The model correctly classified 13 out of 14 records, giving an accuracy of 92.86%.
2. **False Positive & Negative Rates**: Only 1 false negative was recorded across the 14 validation records, with zero false positives.
3. **Inference Latency**: The average inference latency was 14.2 milliseconds per patient record on CPU.
4. **Generalization Note**: Hyperparameters were tuned using 5-fold cross validation on the training split prior to evaluating the 14-record test cohort.
`,
  },
];
