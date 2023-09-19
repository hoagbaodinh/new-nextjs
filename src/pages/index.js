import Head from "next/head";

import { MongoClient } from "mongodb";

import MeetupList from "@/components/meetups/MeetupList";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React Meetup</title>
        <meta
          name="description"
          content="Browse a huge list of React Meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </>
  );
};

// export const getServerSideProps = (context) => {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://hoagbaodinh:cML4iJFtSGw9nrFk@cluster0.u4h9gqd.mongodb.net/meetup?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
};

export default HomePage;
