import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

const InstructorCard = ({ image, name, title }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden w-64 relative group">
      {/* Instructor Image */}
      <img src={image} alt={name} className="w-full h-48 object-cover" />

      {/* Instructor Info */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600">{title}</p>
      </div>

      {/* Social Media Icons - Centered with default brand colors */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex space-x-4">
          <a href="#" className="text-[#1DA1F2] hover:scale-110 transition-transform">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-[#0A66C2] hover:scale-110 transition-transform">
            <FaLinkedin size={20} />
          </a>
          <a href="#" className="text-[#1877F2] hover:scale-110 transition-transform">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="text-[#E1306C] hover:scale-110 transition-transform">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  return (
    <section id="team" className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Strong Team</h2>
        <p className="text-lg text-gray-600 mb-12">
          Tellus dignissim per; ad pharetra nec amet. Vulputate magna phasellus non urna semper proin ultrices aenean sit nullam.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <InstructorCard image="src/images/img4.jpg" name="Glen Butler" title="Physics Tutor" />
          <InstructorCard image="src/images/img5.jpg" name="Jane Cooper" title="AI Tutor" />
          <InstructorCard image="src/images/img6.jpg" name="Lesley Cooper" title="Programming Tutor" />
          <InstructorCard image="src/images/img7.jpg" name="Marley Allison" title="Hardware Tutor" />
        </div>
      </div>
    </section>
  );
};

export default Team;
