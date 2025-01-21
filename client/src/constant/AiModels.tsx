import { OpenAI, Midday, StabilityAI, Gemini, Runway } from './Logo';

export const AiModels = [
  {
    id: 1,
    name: 'DALL-E 3',
    description: "OpenAI's latest image generation model.",
    badge: 'OpenAI',
    image: <OpenAI />,
  },
  {
    id: 2,
    name: 'Midday',
    description: 'AI image generator optimized for commercial and artistic use',
    badge: 'Midday',
    image: <Midday />,
  },
  {
    id: 3,
    name: 'Diffusion XL',
    description: 'Image generator, offering open-source flexibility',
    badge: 'Stability AI',
    image: <StabilityAI />,
  },
  {
    id: 4,
    name: 'Gemini',
    description: 'Multimodal AI system capable of generating and editing images.',
    badge: 'Google',
    image: <Gemini />,
  },
  {
    id: 5,
    name: 'Runway',
    description: 'Specialized in creative tools for visual content creators',
    badge: 'Runway AI',
    image: <Runway />,
  },
  { id: 80, name: 'Other Model', description: 'Another AI model', badge: 'Other', image: null },
];
