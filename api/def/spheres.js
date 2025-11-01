// ===============================================
// Mage Sheet Module - Definições das Esferas
// ===============================================
export class Spheres {
  static _initializeDefinitions() {
    console.log("Mage Sheet Module | Inicializando definições das Esferas");

    // 🔮 Defina aqui as Esferas que existirão no jogo
    // Isso é um exemplo, adapte à sua estrutura
    this.definitions = {
      forces: {
        label: "Forces",
        description: "Manipulação de energia, movimento e física."
      },
      life: {
        label: "Life",
        description: "Controle sobre seres vivos e biologia."
      },
      mind: {
        label: "Mind",
        description: "Percepção, pensamento e consciência."
      },
      matter: {
        label: "Matter",
        description: "Controle sobre substâncias e objetos físicos."
      },
      spirit: {
        label: "Spirit",
        description: "Comunicação e influência nos mundos espirituais."
      },
      correspondence: {
        label: "Correspondence",
        description: "Compreensão do espaço e da conexão entre locais."
      },
      entropy: {
        label: "Entropy",
        description: "Probabilidade, sorte e decadência."
      },
      time: {
        label: "Time",
        description: "Manipulação da passagem do tempo e premonição."
      },
      prime: {
        label: "Prime",
        description: "Energia primordial e essência mágica."
      }
    };
  }
}
