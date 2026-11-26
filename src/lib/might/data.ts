export type Dim = "pers" | "power" | "char";
export const DIMS: { key: Dim; label: string }[] = [
  { key: "pers", label: "Personalidade" },
  { key: "power", label: "Poder" },
  { key: "char", label: "Carácter" },
];
export const TAGS: Record<Dim, string[]> = {
  pers: ["Curiosa", "Divertida", "Calma", "Ousada", "Empática", "Criativa", "Determinada", "Otimista"],
  power: ["Comunicar", "Liderar", "Analisar", "Criar", "Organizar", "Resolver", "Inspirar", "Ensinar"],
  char: ["Honesta", "Leal", "Resiliente", "Generosa", "Justa", "Humilde", "Corajosa", "Responsável"],
};
export type Triple = Record<Dim, string>;

export const CIRCLES = ["Família", "Amigos", "Trabalho", "Escola", "Comunidade"];

export interface Person { id: string; name: string; role: string; avatar: number }
export const PEOPLE: Person[] = [
  { id: "ana", name: "Ana Ribeiro", role: "Colega de equipa", avatar: 1 },
  { id: "joao", name: "João Matos", role: "Amigo de infância", avatar: 2 },
  { id: "ines", name: "Inês Costa", role: "Irmã", avatar: 3 },
  { id: "rui", name: "Rui Almeida", role: "Ex-chefe", avatar: 4 },
  { id: "marta", name: "Marta Sousa", role: "Professora", avatar: 5 },
  { id: "tiago", name: "Tiago Ferreira", role: "Colega de curso", avatar: 0 },
  { id: "sofia", name: "Sofia Lopes", role: "Vizinha", avatar: 1 },
];

export function tagline(t: Triple) {
  return `Pessoa ${t.pers.toLowerCase()} e ${t.char.toLowerCase()}, que nasceu para ${t.power.toLowerCase()}.`;
}

export interface Profile { id: string; name: string; job: string; avatar: number; tags: Record<Dim, string[]> }
export const PROFILES: Profile[] = [
  { id: "p1", name: "Beatriz N.", job: "Designer de produto", avatar: 3, tags: { pers: ["Criativa", "Curiosa"], power: ["Criar", "Comunicar"], char: ["Honesta", "Generosa"] } },
  { id: "p2", name: "Duarte P.", job: "Analista de dados", avatar: 4, tags: { pers: ["Calma", "Determinada"], power: ["Analisar", "Resolver"], char: ["Responsável", "Justa"] } },
  { id: "p3", name: "Carolina M.", job: "Gestora de comunidade", avatar: 1, tags: { pers: ["Empática", "Divertida"], power: ["Comunicar", "Inspirar"], char: ["Leal", "Generosa"] } },
  { id: "p4", name: "Miguel T.", job: "Fundador de startup", avatar: 2, tags: { pers: ["Ousada", "Otimista"], power: ["Liderar", "Inspirar"], char: ["Corajosa", "Resiliente"] } },
  { id: "p5", name: "Leonor F.", job: "Formadora", avatar: 5, tags: { pers: ["Empática", "Calma"], power: ["Ensinar", "Comunicar"], char: ["Humilde", "Honesta"] } },
  { id: "p6", name: "Pedro G.", job: "Gestor de projeto", avatar: 0, tags: { pers: ["Determinada", "Calma"], power: ["Organizar", "Liderar"], char: ["Responsável", "Leal"] } },
  { id: "p7", name: "Rita A.", job: "Engenheira de software", avatar: 3, tags: { pers: ["Curiosa", "Determinada"], power: ["Resolver", "Analisar"], char: ["Resiliente", "Honesta"] } },
];

export interface Role { name: string; tags: string[]; path: [string, string, string]; why: string }
export const ROLES: Role[] = [
  { name: "Designer de Experiência (UX)", tags: ["Criativa", "Curiosa", "Empática", "Criar", "Resolver", "Generosa"], path: ["Fazer um curso de UX e redesenhar uma app que usas", "Estágio numa equipa de produto", "Liderar a pesquisa de um produto inteiro"], why: "Junta criatividade com vontade de perceber as pessoas." },
  { name: "Analista de Dados", tags: ["Calma", "Curiosa", "Analisar", "Resolver", "Responsável", "Justa"], path: ["Aprender SQL e explorar dados públicos", "Analista júnior numa equipa de negócio", "Construir modelos que orientam decisões"], why: "Gosta de encontrar padrões e de chegar a respostas justas." },
  { name: "Gestor/a de Comunidade", tags: ["Empática", "Divertida", "Otimista", "Comunicar", "Inspirar", "Leal", "Generosa"], path: ["Dinamizar um grupo ou clube local", "Community manager numa marca", "Criar e escalar uma comunidade própria"], why: "Liga pessoas e mantém a energia do grupo em alta." },
  { name: "Empreendedor/a", tags: ["Ousada", "Otimista", "Determinada", "Liderar", "Inspirar", "Corajosa", "Resiliente"], path: ["Lançar um pequeno projeto paralelo", "Juntar-se a uma startup em fase inicial", "Fundar a tua própria empresa"], why: "Arrisca, puxa pelos outros e não desiste à primeira." },
  { name: "Formador/a ou Educador/a", tags: ["Empática", "Calma", "Ensinar", "Comunicar", "Humilde", "Generosa", "Responsável"], path: ["Dar explicações ou mentorias", "Formador/a numa academia", "Desenhar programas de formação"], why: "Tem paciência e gosto em ver os outros crescer." },
  { name: "Gestor/a de Projeto", tags: ["Determinada", "Calma", "Organizar", "Liderar", "Responsável", "Leal", "Justa"], path: ["Organizar um evento do início ao fim", "Coordenador/a de projeto júnior", "Gerir um portefólio de projetos"], why: "Põe ordem no caos e garante que as coisas acontecem." },
  { name: "Engenheiro/a de Software", tags: ["Curiosa", "Determinada", "Resolver", "Analisar", "Criar", "Resiliente"], path: ["Construir um projeto pessoal em código", "Programador/a júnior", "Arquitetar sistemas complexos"], why: "Adora desmontar problemas e construir soluções." },
  { name: "Comunicação & Marketing", tags: ["Criativa", "Divertida", "Ousada", "Comunicar", "Criar", "Inspirar", "Honesta"], path: ["Gerir as redes de um projeto que gostes", "Assistente de marketing", "Liderar a voz de uma marca"], why: "Sabe contar histórias que fazem as pessoas reagir." },
  { name: "Recursos Humanos & Talento", tags: ["Empática", "Calma", "Comunicar", "Organizar", "Justa", "Honesta", "Humilde"], path: ["Ajudar a recrutar para uma associação", "Recrutador/a júnior", "Liderar a cultura de uma organização"], why: "Vê o potencial nos outros e trata todos com justiça." },
];
