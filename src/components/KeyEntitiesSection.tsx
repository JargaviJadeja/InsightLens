import React, { useState } from "react";
import { Users, Building2, Cpu, Package, MapPin, Activity, Filter, Search } from "lucide-react";
import { EntityItem } from "../types/index.ts";

interface KeyEntitiesSectionProps {
  entities: EntityItem[];
}

export const KeyEntitiesSection: React.FC<KeyEntitiesSectionProps> = ({
  entities,
}) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const types = ["all", ...Array.from(new Set(entities.map((e) => e.type.toLowerCase()).filter(Boolean)))];

  const filteredEntities = entities.filter((e) => {
    const matchesType = selectedType === "all" || e.type.toLowerCase() === selectedType;
    const matchesSearch =
      searchTerm.trim() === "" ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getEntityIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("person") || t.includes("author") || t.includes("researcher")) {
      return Users;
    }
    if (t.includes("org") || t.includes("company") || t.includes("institution")) {
      return Building2;
    }
    if (t.includes("tech") || t.includes("chip") || t.includes("algorithm") || t.includes("model")) {
      return Cpu;
    }
    if (t.includes("product") || t.includes("drug") || t.includes("cell")) {
      return Package;
    }
    if (t.includes("location") || t.includes("city") || t.includes("country")) {
      return MapPin;
    }
    return Activity;
  };

  return (
    <div id="key-entities-container" className="space-y-6">
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f3f4] dark:border-[#303134]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] dark:bg-[#1a2e4c] flex items-center justify-center text-[#1a73e8] dark:text-[#8ab4f8]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
                Key Entities Identified
              </h2>
              <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                {filteredEntities.length} of {entities.length} organizations, technologies, products, datasets, and standards
              </span>
            </div>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entities..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#171819] text-[#202124] dark:text-[#e8eaed] placeholder-[#80868b] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8] dark:focus:ring-[#8ab4f8] focus:bg-white dark:focus:bg-[#1e1f20]"
            />
          </div>
        </div>

        {/* Entity Type Filter Tabs */}
        {types.length > 2 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Entity Type:
            </span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedType === type
                    ? "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#1a73e8]/30 dark:border-[#8ab4f8]/30 font-semibold"
                    : "bg-[#f1f3f4] dark:bg-[#282a2d] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#e8eaed] dark:hover:bg-[#3c4043]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Entity Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredEntities.map((entity, idx) => {
            const Icon = getEntityIcon(entity.type);
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#f8f9fa] dark:bg-[#282a2d]/60 border border-[#e8eaed] dark:border-[#3c4043] hover:border-[#dadce0] dark:hover:border-[#5f6368] transition-all flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white dark:bg-[#1e1f20] text-[#3c4043] dark:text-[#bdc1c6] border border-[#dadce0] dark:border-[#3c4043] flex items-center gap-1.5 shadow-2xs">
                      <Icon className="w-3 h-3 text-[#1a73e8] dark:text-[#8ab4f8]" />
                      {entity.type}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        entity.relevance === "high"
                          ? "text-[#1a73e8] dark:text-[#8ab4f8] font-bold"
                          : "text-[#80868b] dark:text-[#9aa0a6]"
                      }`}
                    >
                      {entity.relevance} relevance
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed] mb-1 leading-snug">
                    {entity.name}
                  </h4>
                  <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">
                    {entity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
