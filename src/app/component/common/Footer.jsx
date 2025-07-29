const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-6 mt-12 border-t">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SalonFinder. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
