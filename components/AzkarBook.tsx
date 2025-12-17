import React, { useState } from 'react';

interface AzkarItem {
  id: string;
  text: string;
  translation: string;
  count: number;
  reference: string;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: AzkarItem[];
}

const azkarData: Category[] = [
  {
    id: 'morning',
    title: 'Morning',
    icon: '🌅',
    color: 'from-orange-400 to-rose-400',
    items: [
      {
        id: 'm1',
        text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        translation: 'We have entered the morning and at this very time the whole kingdom belongs to Allah, All praise is due to Allah. There is no god but Allah, the One; He has no partner.',
        count: 1,
        reference: 'Muslim 4:2088'
      },
      {
        id: 'm2',
        text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.',
        count: 1,
        reference: 'Tirmidhi 3:142'
      }
    ]
  },
  {
    id: 'evening',
    title: 'Evening',
    icon: '🌇',
    color: 'from-blue-600 to-indigo-900',
    items: [
      {
        id: 'e1',
        text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        translation: 'We have entered the evening and at this very time the whole kingdom belongs to Allah, All praise is due to Allah. There is no god but Allah, the One; He has no partner.',
        count: 1,
        reference: 'Muslim 4:2088'
      },
      {
        id: 'e2',
        text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        translation: 'I seek protection in the perfect words of Allah from every evil that He has created.',
        count: 3,
        reference: 'Muslim 4:2080'
      }
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep',
    icon: '🌙',
    color: 'from-indigo-900 to-slate-900',
    items: [
      {
        id: 's1',
        text: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
        translation: 'In Your name my Lord, I lie down, and in Your name I rise. If You should take my soul then have mercy upon it, and if You should return my soul then protect it in the manner You do so with Your righteous servants.',
        count: 1,
        reference: 'Bukhari 11:126'
      },
      {
        id: 's2',
        text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        translation: 'O Allah, protect me from Your punishment on the day Your cause Your servants to rise.',
        count: 3,
        reference: 'Abu Dawud 4:311'
      }
    ]
  },
  {
    id: 'prayer',
    title: 'After Prayer',
    icon: '📿',
    color: 'from-teal-600 to-emerald-800',
    items: [
      {
        id: 'p1',
        text: 'أَسْتَغْفِرُ اللَّهَ (٣ مرات) اللَّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
        translation: 'I ask Allah for forgiveness (3 times). O Allah, You are As-Salam and from You is all peace, blessed are You, O Possessor of majesty and honour.',
        count: 1,
        reference: 'Muslim 1:414'
      }
    ]
  }
];

export const AzkarBook: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-[calc(100vh-100px)] flex flex-col items-center">
      {!selectedCategory ? (
        <div className="w-full animate-fade-in-up">
           <h2 className="text-3xl md:text-4xl font-arabic text-moroccan-teal font-bold text-center mb-8">Fortress of the Muslim</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {azkarData.map((cat) => (
               <button
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat)}
                 className={`relative overflow-hidden group p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-gradient-to-br ${cat.color}`}
               >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10 flex items-center space-x-4">
                    <span className="text-4xl">{cat.icon}</span>
                    <div className="text-left text-white">
                        <h3 className="text-2xl font-bold font-serif">{cat.title}</h3>
                        <p className="opacity-80 text-sm">{cat.items.length} Authentic Duas</p>
                    </div>
                 </div>
               </button>
             ))}
           </div>
        </div>
      ) : (
        <div className="w-full animate-fade-in-up">
            <button 
                onClick={() => setSelectedCategory(null)}
                className="mb-6 flex items-center text-moroccan-teal font-bold hover:underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Categories
            </button>
            
            <div className={`p-6 rounded-2xl bg-gradient-to-r ${selectedCategory.color} text-white mb-8 shadow-md`}>
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">{selectedCategory.icon}</span>
                    <h2 className="text-3xl font-bold font-serif">{selectedCategory.title} Azkar</h2>
                </div>
            </div>

            <div className="space-y-6">
                {selectedCategory.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md border border-moroccan-gold/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-moroccan-teal"></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-moroccan-sand/30 text-moroccan-dark px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                {item.reference}
                            </span>
                            <span className="bg-moroccan-teal text-white px-3 py-1 rounded-full text-xs font-bold">
                                Repeat: {item.count}x
                            </span>
                        </div>
                        <p className="text-2xl md:text-3xl text-right font-arabic leading-loose text-moroccan-dark mb-4" dir="rtl">
                            {item.text}
                        </p>
                        <p className="text-gray-600 italic text-sm md:text-base leading-relaxed border-t border-gray-100 pt-4">
                            "{item.translation}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};