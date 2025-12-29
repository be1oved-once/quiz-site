let db = null;
let updateDoc, doc, arrayUnion;

try {
  const fb = await import("./firebase.js");
  db = fb.db;

  const fs = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
  updateDoc = fs.updateDoc;
  doc = fs.doc;
  arrayUnion = fs.arrayUnion;
} catch (e) {
  console.warn("Firebase not ready, bookmarks disabled");
}

export async function saveBookmark(uid, questionId) {
  await updateDoc(doc(db, "users", uid), {
    bookmarks: arrayUnion(questionId)
  });
}
export const subjects = [
  {
    id: "eco",
    name: "Economics",
    chapters: [
      {
  id: "eco_ch1",
  name: "Nature and Scope of Business Economics",
  questions: [
    { text:"The interference of the government is very limited in-", options:["Socialist economy","Capitalist economy","Mixed economy","All the above"], correctIndex:1 },

    { text:"Normative economics is in nature", options:["modern","descriptive","prescriptive","none of the above"], correctIndex:2 },

    { text:"As compared to other economic systems, inequalities of incomes is relatively less in economic system", options:["Capitalist","Socialist","Mixed","None of the above"], correctIndex:1 },

    { text:"\"Ends\" refer to", options:["Human Wants","Resources","Both (a) and (b)","Neither (a) nor (b)"], correctIndex:0 },

    { text:"Integration of Economic theory with business practice is called", options:["Managerial Economics","Business Economics","Applied Economics","All of the above"], correctIndex:3 },

    { text:"The Central Problems arise in case of", options:["Capitalist Economies","Socialist Economies","Mixed Economies","All of the above"], correctIndex:3 },

    { text:"labour Intensive Technique would get chosen in:", options:["Labour Surplus Economy","Capital Surplus Economy","Developed Economy","Developing Economy"], correctIndex:0 },

    { text:"Which of the following applies to a Capitalist Economy?", options:["Profit Motive","Government Regulation","Equal distribution of OIncomes","Absence of Competition among various producing\nFirms"], correctIndex:0 },

    { text:"In a Mixed Economy, Industries in Private Sector have ...... as their objective and driving force.", options:["profit motive only","community welfare only","Both (a) and (b)","Neither (a) nor (b)"], correctIndex:0 },

    { text:"'Economics is the science of choice making' it implies:-", options:["No choice is to be made Choice to be made","between alternative uses","Choice to be made between means and ends","None of the above."], correctIndex:1 },

    { text:"A capitalist economy consists of", options:["Central planning authority","A mechanism to decide as to what, how and for whom to produce","Both 1 and 2","None of the above"], correctIndex:1 },

    { text:"The 'communist manifesto' related to socialist economy propounded by Karl Marx and Frederic Engels was published in:", options:["1950","1848","1849","1951"], correctIndex:1 },

    { text:"'Consumer sovereignty' is a feature of:", options:["Capitalist","Socialist","Mixed","Command"], correctIndex:0 },

    { text:"The central problems relating to allocation of resources are-", options:["What to produce?","How to produce?","For whom to produce?","All the above."], correctIndex:3 },

    { text:"Positive economics\ndeals with-", options:["What is","What ought to be","Both 'a' 'b'","None of these"], correctIndex:0 },

    { text:"The problem of what goods and services are produced and how much, is covered by the general term-", options:["Resource allocation","Choice of technique of\nproduction","distribution","macro-economics"], correctIndex:0 },

    { text:"Which of the following is considered as a disadvantage of allocating resources in a capitalist economy?", options:["Income will tend to be unevenly distributed","People do not get goods of Otheir choice","Men of initiative and enterprise are not rewarded","Profits will tend to be low"], correctIndex:0 },

    { text:"Human Wants are", options:["Extravagant","Scarce","Unlimited","Restricted"], correctIndex:2 },

    { text:"Resources are scarce in relation to", options:["Human Wants","Firm's Profit Motive","Country's Social Goals","All of the above"], correctIndex:0 },

    { text:"Business economics is a science because", options:["It establishes a cause and effect relationship","Integrates the tools of decision sciences","Follows scientific methods and empirically tests the validity of the results.","All of the above"], correctIndex:3 },

    { text:"An economy which uses all its resources on production _____ of Goods only, cannot provide for future growth prospects.", options:["Capital Goods only","Consumer Goods only","Both (a) and (b)","Neither (a) nor (b)"], correctIndex:2 },

    { text:"In deciding \"How to produce\", the economy should decide on", options:["types of goods to be produced","quantity of goods to be produced","consumer goods and capital goods","methods of production"], correctIndex:3 },

    { text:"Production of Capital Goods vs Consumer Goods relates to the problem of", options:["What to Produce","How to Produce","For whom to Produce","How to provide for growth"], correctIndex:3 },

    { text:"Use of Labour or Capital intensive techniques of production relates to the problem of", options:["What to Produce","How to Produce","For whom to Produce","How to provide for growth"], correctIndex:1 },

    { text:"In which among the following systems the \"Right to property\" exists", options:["Mixed","Capitalist","Socialist","Traditional"], correctIndex:1 },

    { text:"Identify the correct statement:", options:[
        "In Capitalist Economy, people are not free to spend their income as they Like",
        "In Socialist Economy, the right to work is guaranteed but the choice of occupation gets restricted",
        "In Socialist Economy, a relative inequality in income is an important\nfeature",
        "In today's world, USA is a purely Socialist Country."
      ], correctIndex:1 },

    { text:"Indian Economy is an example of", options:["Capitalist Economy","Socialist Economy","Mixed Economy","None of the above"], correctIndex:2 },

    { text:"\"Features of the book wealth of nations\"", options:["It was the first book use on economics","It was created in 1776","It was also known as 'wealth of nations'","All of the above."], correctIndex:3 },

    { text:"Business Economics is essentially a component of Applied Economics as it includes application of selected quantitatives techniques which technique is not included in it ?", options:["Regression analysis","Economic analysis","Capital budgeting","Linear programming"], correctIndex:1 },

    { text:"Under which of the following economy the consumer have limited freedom of choice?", options:["Socialist","Mixed","Capitalist","Restricted"], correctIndex:0 },

    { text:"An Economic system in which all means of production are owned and controlled by Private Individual is called as ?", options:["Free Economy","Capitalist Economy","Normative Economy","Both (a) and (b)"], correctIndex:1 },

    { text:"A mixed economy to solve its central problems relies on-", options:["Economic planning","Price mechanism","Price fixing","Both 'a' and 'b'"], correctIndex:3 },

    { text:"In a socialist economy, the basic force of economic activity is profit. This statement is-", options:["Correct","Incorrect","Partially correct","None of these"], correctIndex:1 },

    { text:"One of the important features of capitalist economy is-", options:["Economic planning","Price mechanism","Economic qualities","Social welfare"], correctIndex:1 },

    { text:"Positive economics remains strictly neutral towards ends. This means that-", options:[
        "Positive economics study the facts as they are",
        "Positive economics is prescriptive in nature",
        "Positive economics is based on ethical, philosophical and religious beliefs",
        "Only (a) and (b)"
      ], correctIndex:0 },

    { text:"In a capitalistic economy what to produce depends on-", options:["governments is policy","consumer's preference","profits of firm","none of these"], correctIndex:1 },

    { text:"\"Means\" refer to", options:["Human Wants","Resources","Both (a) and (b)","Neither (a) nor (b)"], correctIndex:1 },

    { text:"Which of the following is not a central problem of economy?", options:["How to Produce","When to Produce","What to Produce","None of these"], correctIndex:1 },

    { text:"Which of the following is not one of the four central questions that the study of economics is supposed to answer?", options:["Who produces what","When are goods produced","Who consumes what","How are goods produced"], correctIndex:1 },

    { text:"Capital Intensive Technique would get chosen in", options:["Labour Surplus Economy","Capital Surplus Economy","Developed Economy","Developing Economy"], correctIndex:1 },

    { text:"A system of economy in which all means of production are owned and controlled by private individuals for the purpose profit is of called_____", options:["Socialistic economy","Capitalistic economy","Mixed economy","All of the above"], correctIndex:1 },

    { text:"In India, the Central Planning Authority is called___", options:["State Government","President of India","Ministry of Economy","NITI Aayog"], correctIndex:3 },

    { text:"Which one in the following is not correct:", options:["There are limited wants","Means are scarce","Resources have alternative uses","Economics is science"], correctIndex:0 },

    { text:"Business Economics is also known as?", options:["Applied Economics","Managerial Economics","Micro Economics","All of the above"], correctIndex:3 },

    { text:"Consumer sovereignty is which of the following characteristics?", options:["Capitalist economy","Mixed economy","Socialist economy","Democracy"], correctIndex:0 },

    { text:"The nature of business economics is :", options:["Positive in nature","Pragmatic","Pure science","Independent"], correctIndex:1 },

    { text:"The Famous book abbreviated as \"The Wealth of Nations\", which is also considered as the first modern work of  Economics, was written by:", options:["Frederic Engels","Karl Marx","David Ricardo","Adam Smith"], correctIndex:3 },

    { text:"Which of the following statement is correct?", options:[
        "Mixed economy is not always a golden path between capitalism and socialism.",
        "Socialistic economy is not always a golden path between mixed and Capitalism.",
        "Capitalism economy is not always a golden path between mixed and socialism.",
        "Mixed economy is always a golden path between capitalism and socialism."
      ], correctIndex:0 },

    { text:"The term socialist economy was coined by", options:["Alfred Marshall","Albert Einstein","Joel Dean","Karl Marx and Friedrich Engels"], correctIndex:3 },

    { text:"Normative science refers to :", options:["What to produce","How to produce","Whom to produce","What should be"], correctIndex:3 },

    { text:"The basic problem of scarcity gives rise to:", options:["technological problems","social problems","cultural problems","Deconomic problems"], correctIndex:3 },

    { text:"Business economics is _____ an approach.", options:["Positive in nature","Pragmatic","Pure science","Independent"], correctIndex:1 },

    { text:"Which of the following is not one of the four central question that the study of economics is supposed to answer?", options:["When are goods produced?","What to produce?","How to produce?","What provisions are to be made for economic growth?"], correctIndex:0 },

    { text:"Which statement differentiates business economics from economics?", options:["lt is abstract in nature","It is narrow concept than economics","It is no different from economics","It is pragmatic in nature"], correctIndex:3 },

    { text:"Positive statements concern what is; normative statements concern-", options:["What was","What is the normal situation","What will be","What ought to be"], correctIndex:3 },

    { text:"Find the odd", options:[
        "Normative economics is concerned with welfare propositions.",
        "Normative economics is prescriptive in nature.",
        "Normative economics is regulatory in nature.",
        "Economic laws are Hypothetical."
      ], correctIndex:3 },

    { text:"Wastes of competition are found in-", options:["Capitalist economy","Socialist economy","Mixed economy","None of these"], correctIndex:0 },

    { text:"'A government deficit will reduce unemployment and cause an increase in prices'. This statement is-", options:["Positive","Normative","Incomplete","None of these"], correctIndex:0 }
  ]
},
      {
        id: "eco_ch2",
        name: "Demand & Supply",
        questions: [
          {
            text: "Law of demand shows",
            options: ["Inverse relation", "Direct relation", "No relation", "Random"],
            correctIndex: 0
          }
        ]
      }
    ]
  },

  {
    id: "QA",
    name: "Maths",
    chapters: [
      {
        id: "qa_ch1",
        name: "Basics of Accounting",
        questions: [
          {
            text: "Which is real account?",
            options: ["Cash", "Salary", "Capital", "Sales"],
            correctIndex: 0
          }
        ]
      }
    ]
  }
];
