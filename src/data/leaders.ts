import { LeaderCategory, LeaderProfile } from "@/types";

const principal: LeaderProfile & { speech: string } = {
  name: "ሀፍታይ ገ/ እግዚአብሄር",
  title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ፅ/ቤት ሰብሳቢ",
  photo: "/assets/leaders/ሀፍታይ ገ እግዚአብሄር.jpg",
  speech:
    "የኮሚሽኑን ተቋማዊ አቅም በማጠናከር በፖርቲው መተዳደሪያ ደንብ የተሰጡትን ተግባርና ሀላፊነቶች በየወቅቱ የኢንስፔክሽን ስራ በብቃት በማከናወን በየደረጃው የአቅም ግንባትታ ስልጠና በመስጠት ለፖርቲ እሴት ሊጨምሮ የሚችሉ ግኝቶችን ከምክረ ሀሳቦች ጋር ግብረ መልስ በመስጠት  ለፖርቲ ጥንካሬ የበኩሉን አስተዋፅኦ ማድረግ የኮሚሽኑ የዕቅድ ዓላማችን ነው",
};

const categories: LeaderCategory[] = [
  {
    id: "commission-committee",
    title: "የኮሚሽን ኮሚቴ አባላት",
    leaders: [
      {
        name: "ሀፍታይ ገ/ እግዚአብሄር",
        title: "የኮሚሽን ኮሚቴ ሰብሳቢ",
        photo: "/assets/leaders/ሀፍታይ ገ እግዚአብሄር.jpg",
      },
    ],
  },
  {
    id: "management",
    title: "የኮሚሽን ማኔጅመንት አባላት",
    leaders: [
      {
        name: "ሀፍታይ ገ/ እግዚአብሄር",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ፅ/ቤት ሰብሳቢ",
        photo: "/assets/leaders/ሀፍታይ ገ እግዚአብሄር.jpg",
      },
      {
        name: "ጥላሁን ሮባ",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ቅ/ፅ/ቤት ም/ሰብሳቢ",
        photo: "/assets/leaders/unk.jpg",
      },
      {
        name: "መሪማ ደሊል",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ፅ/ቤት ፀሀፊና የፅ/ቤት ሀላፊ",
        photo: "/assets/leaders/መሪማ ደሊል.jpg",
      },
      {
        name: "አታላይ ምህረት",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ፅ/ቤት የኢንስፔክሽን ዘርፍ ሀላፊ",
        photo: "/assets/leaders/አታላይ ምህረት.jpg",
      },
      {
        name: "Unknown 1",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ቅ/ፅ/ቤት ም/ሰብሳቢ",
        photo: "/assets/leaders/unk1.jpg",
      },
    ],
  },
  {
    id: "work-leadership",
    title: "ስራ አባላት",
    leaders: [
      {
        name: "ሀፍታይ ገ/ እግዚአብሄር",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ፅ/ቤት ሰብሳቢ",
        photo: "/assets/leaders/ሀፍታይ ገ እግዚአብሄር.jpg",
      },
      {
        name: "መሪማ ደሊል",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ፅ/ቤት ፀሀፊና የፅ/ቤት ሀላፊ",
        photo: "/assets/leaders/መሪማ ደሊል.jpg",
      },
      {
        name: "አታላይ ምህረት",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ፅ/ቤት የኢንስፔክሽን ዘርፍ ሀላፊ",
        photo: "/assets/leaders/አታላይ ምህረት.jpg",
      },
      {
        name: "ጥላሁን ሮባ",
        title: "የአዲስ አበባ ብልፅግና የኢንስፔክሽን የስነ ምግባር ኮሚሽን ቅ/ፅ/ቤት ም/ሰብሳቢ",
        photo: "/assets/leaders/unk.jpg",
      },
    ],
  },
  {
    id: "monitoring-committees",
    title: "የክትትልና ድጋፍ ንዑሳን ኮሚቴ አባላት",
    leaders: [
      {
        name: "ሀፍታይ ገ/ እግዚአብሄር",
        title: "የተቋም ግንባታ ክትትልና ድጋፍ ንዑስ ኮሚቴ ሰብሳቢ",
        photo: "/assets/leaders/ሀፍታይ ገ እግዚአብሄር.jpg",
      },
      {
        name: "ጥላሁን ሮባ",
        title: "የአካላትና የአባላት መብት ክትትልና ድጋፍ ንዑስ ኮሚቴ ሰብሳቢ",
        photo: "/assets/leaders/unk.jpg",
      },
      {
        name: "መሪማ ደሊል",
        title: "የፖርቲ ገንዘብ ንብረት ሰነድ ክትትል ድጋፍ ንዑስ ኮሚቴ ሰብሳቢ",
        photo: "/assets/leaders/መሪማ ደሊል.jpg",
      },
    ],
  },
];

export const woredaLeadership = {
  principal,
  categories,
};
