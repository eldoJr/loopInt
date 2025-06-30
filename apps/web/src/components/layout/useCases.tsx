import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const UseCases = () => {
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const [showMoreUseCases, setShowMoreUseCases] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreTemplates, setShowMoreTemplates] = useState(false);
  const [showMoreGuides, setShowMoreGuides] = useState(false);

  const ExpandButton = ({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) => (
    <li
      className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer text-sm font-medium transition-colors duration-200 group"
      onClick={onClick}
    >
      <span className="mr-1">{isExpanded ? "Show less" : "Show more"}</span>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 group-hover:translate-y-[-1px] transition-transform" />
      ) : (
        <ChevronDown className="w-4 h-4 group-hover:translate-y-[1px] transition-transform" />
      )}
    </li>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Explore What's
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Possible Today
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover trending features, use cases, and resources to maximize your business potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/30 hover:border-gray-700/50 transition-all duration-300">
            <h3 className="font-bold text-lg mb-6 text-white border-b border-gray-700/50 pb-3">
              Popular Features
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Project Management</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Team Collaboration</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Financial Tracking</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Automated Workflows</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Real-time Analytics</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Custom Dashboards</li>
              {showMoreFeatures && (
                <>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">API Integrations</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Role-based Access</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Mobile Apps</li>
                </>
              )}
              <ExpandButton 
                isExpanded={showMoreFeatures} 
                onClick={() => setShowMoreFeatures(!showMoreFeatures)} 
              />
            </ul>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/30 hover:border-gray-700/50 transition-all duration-300">
            <h3 className="font-bold text-lg mb-6 text-white border-b border-gray-700/50 pb-3">
              Trending Use Cases
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Remote Team Management</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Invoice Automation</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Client Onboarding</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Inventory Management</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Performance Tracking</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Compliance Management</li>
              {showMoreUseCases && (
                <>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Expense Tracking</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Risk Assessment</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Vendor Management</li>
                </>
              )}
              <ExpandButton 
                isExpanded={showMoreUseCases} 
                onClick={() => setShowMoreUseCases(!showMoreUseCases)} 
              />
            </ul>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/30 hover:border-gray-700/50 transition-all duration-300">
            <h3 className="font-bold text-lg mb-6 text-white border-b border-gray-700/50 pb-3">
              Top Categories
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Business Operations</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Finance & Accounting</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Human Resources</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Sales & Marketing</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Customer Support</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Data Analytics</li>
              {showMoreCategories && (
                <>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Legal & Compliance</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">IT & Security</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Supply Chain</li>
                </>
              )}
              <ExpandButton 
                isExpanded={showMoreCategories} 
                onClick={() => setShowMoreCategories(!showMoreCategories)} 
              />
            </ul>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/30 hover:border-gray-700/50 transition-all duration-300">
            <h3 className="font-bold text-lg mb-6 text-white border-b border-gray-700/50 pb-3">
              Ready-to-Use Templates
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Project Proposal Template</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Invoice Template</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Team Meeting Agenda</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Budget Planning Sheet</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Client Contract Template</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Performance Review Form</li>
              {showMoreTemplates && (
                <>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Marketing Campaign Brief</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Risk Assessment Template</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Onboarding Checklist</li>
                </>
              )}
              <ExpandButton 
                isExpanded={showMoreTemplates} 
                onClick={() => setShowMoreTemplates(!showMoreTemplates)} 
              />
            </ul>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/30 hover:border-gray-700/50 transition-all duration-300">
            <h3 className="font-bold text-lg mb-6 text-white border-b border-gray-700/50 pb-3">
              Helpful Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Getting Started Guide</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Best Practices for Teams</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Workflow Optimization</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Integration Setup Guide</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Security Best Practices</li>
              <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Advanced Features Tutorial</li>
              {showMoreGuides && (
                <>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">API Documentation</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Troubleshooting Guide</li>
                  <li className="text-gray-300 hover:text-white transition-colors cursor-pointer">Video Tutorials</li>
                </>
              )}
              <ExpandButton 
                isExpanded={showMoreGuides} 
                onClick={() => setShowMoreGuides(!showMoreGuides)} 
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;