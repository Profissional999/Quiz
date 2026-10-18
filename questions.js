/*
  Banco de questões do quiz.

  Para editar: altere apenas este arquivo.
  - options:     lista de alternativas (2 para verdadeiro/falso, 4 para múltipla escolha)
  - correct:     posição da alternativa correta na lista (começa em 0: A = 0, B = 1, C = 2, D = 3)
  - explanation: texto exibido depois da resposta

  As respostas e explicações devem ser conferidas com o material acadêmico
  adotado pela turma antes da publicação definitiva.
*/

const QUESTIONS = [
  {
    type: "Múltipla escolha",
    text: "Qual conduta relacionada ao caso Mariana Ferrer motivou críticas por contribuir para a revitimização da vítima?",
    options: [
      "A apresentação de provas técnicas durante o processo.",
      "A garantia do direito de defesa do acusado.",
      "O uso de referências pessoais irrelevantes para desqualificar a denunciante.",
      "A realização de audiência com participação das partes."
    ],
    correct: 2,
    explanation: "A utilização de referências pessoais irrelevantes para desqualificar a denunciante pode desviar a discussão dos fatos e contribuir para a revitimização."
  },
  {
    type: "Conceito jurídico",
    text: "A vitimização primária corresponde:",
    options: [
      "Ao dano diretamente decorrente do ato de violência, incluindo suas consequências emocionais.",
      "À exposição da vítima a comentários de terceiros após o processo.",
      "À rejeição social sofrida pela vítima depois da denúncia.",
      "À responsabilização internacional do Estado."
    ],
    correct: 0,
    explanation: "A vitimização primária está associada aos danos decorrentes diretamente da violência sofrida, que podem ser físicos, psicológicos e emocionais."
  },
  {
    type: "Múltipla escolha",
    text: "Sobre a violência física e a violência psicológica, assinale a alternativa correta.",
    options: [
      "A violência psicológica somente existe quando há lesão corporal.",
      "A violência física não pode coexistir com a violência psicológica.",
      "A violência psicológica exige necessariamente agressão física.",
      "A violência física atinge a integridade corporal, enquanto a psicológica pode envolver controle, humilhação e danos emocionais."
    ],
    correct: 3,
    explanation: "As violências física e psicológica são distintas, mas podem ocorrer conjuntamente. A violência psicológica pode se manifestar por controle, humilhação, ameaça e outras condutas."
  },
  {
    type: "Múltipla escolha",
    text: "Durante audiências e demais atos processuais, quem deve contribuir para que a dignidade da vítima seja respeitada?",
    options: [
      "Exclusivamente a vítima, por meio de sua postura durante a audiência.",
      "Todos os participantes devem respeitar a dignidade da vítima, cabendo ao juízo assegurar o cumprimento das regras aplicáveis.",
      "Somente os advogados das partes, sem participação do juízo.",
      "Apenas os profissionais responsáveis pela gravação da audiência."
    ],
    correct: 1,
    explanation: "O respeito à dignidade deve orientar a atuação dos participantes. O juízo tem papel importante na condução do ato e na observância das normas aplicáveis."
  },
  {
    type: "Múltipla escolha",
    text: "Por que a Lei Mariana Ferrer é relevante mesmo diante das garantias previstas na Constituição Federal?",
    options: [
      "Porque substitui todas as garantias constitucionais relacionadas ao processo.",
      "Porque elimina o direito de defesa em processos que envolvam violência contra a mulher.",
      "Porque estabelece deveres e mecanismos específicos diante de falhas na concretização dos direitos já reconhecidos.",
      "Porque impede a produção de provas durante as audiências."
    ],
    correct: 2,
    explanation: "A existência de direitos constitucionais não impede a criação de mecanismos legais específicos para reforçar sua efetividade e prevenir práticas que violem a dignidade da vítima."
  },
  {
    type: "Múltipla escolha",
    text: "Qual alternativa diferencia corretamente a Comissão Interamericana de Direitos Humanos da Corte Interamericana de Direitos Humanos?",
    options: [
      "A Comissão monitora direitos e formula recomendações; a Corte julga casos relativos à responsabilidade internacional dos Estados nos termos de sua competência.",
      "A Comissão aplica penas criminais nacionais, enquanto a Corte atua apenas como órgão consultivo interno.",
      "A Comissão e a Corte são órgãos do Poder Judiciário brasileiro.",
      "A Corte substitui os tribunais nacionais em todos os processos criminais."
    ],
    correct: 0,
    explanation: "A Comissão exerce funções de promoção, monitoramento e processamento de petições. A Corte exerce funções jurisdicionais e consultivas nos termos dos instrumentos interamericanos aplicáveis."
  },
  {
    type: "Conceito jurídico",
    text: "No contexto da violência contra a mulher, qual alternativa apresenta exemplos de violência moral?",
    options: [
      "Somente a restrição de acesso a serviços públicos.",
      "Exclusivamente a agressão física com lesões aparentes.",
      "Apenas o controle financeiro praticado contra a mulher.",
      "Calúnia, difamação e injúria."
    ],
    correct: 3,
    explanation: "Calúnia, difamação e injúria são condutas associadas à violência moral contra a mulher, conforme a abordagem da Lei Maria da Penha."
  },
  {
    type: "Verdadeiro ou falso",
    text: "Julgar a credibilidade de uma denunciante com base em expectativas sobre como uma mulher deveria se comportar pode reforçar estereótipos de gênero.",
    options: ["Verdadeiro.", "Falso."],
    correct: 0,
    explanation: "Expectativas estereotipadas sobre comportamento, reação ou aparência podem comprometer uma análise imparcial e reproduzir preconceitos de gênero."
  },
  {
    type: "Verdadeiro ou falso",
    text: "O isolamento e a rejeição da vítima pela comunidade são classificados, no material utilizado para este quiz, como vitimização secundária.",
    options: ["Verdadeiro.", "Falso."],
    correct: 1,
    explanation: "Conforme o gabarito do material de referência, a afirmação é falsa: o isolamento e a rejeição pela comunidade são associados à vitimização terciária nessa classificação."
  },
  {
    type: "Verdadeiro ou falso",
    text: "O Estado somente pode ser responsabilizado internacionalmente quando a violência contra a mulher é praticada diretamente por um agente público.",
    options: ["Verdadeiro.", "Falso."],
    correct: 1,
    explanation: "A responsabilização internacional do Estado não se limita a atos praticados diretamente por agentes públicos. Conforme as circunstâncias, também podem ser relevantes omissões estatais e falhas no dever de prevenção, investigação e proteção."
  }
];
