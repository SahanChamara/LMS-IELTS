import Sidebar from "../../components/Sidebar";
import Section from "../../components/Section";
import Performance from "../../homecomponents/Performance";
import AssignedAssessments from "../../homecomponents/assigned";
import Exm from "../../homecomponents/Examr";
import CompletedAssessmentsCard from "../../homecomponents/CompletedAssessmentsCard";
import Completed from "../../homecomponents/CompletedCoursesCard";
import Card, { CardContent } from "../../components/card"

const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-12xl mx-auto p-1">
            <Section>
              <Card className="bg-white">
                <CardContent className="space-y-6 p-">
                  <Completed />
                  <div className="border-t border-gray-200 my-2"></div>
                  <CompletedAssessmentsCard />
                </CardContent>
              </Card>
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
