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
