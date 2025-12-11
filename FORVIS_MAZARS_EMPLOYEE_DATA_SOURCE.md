# Forvis Mazars Employee Data Source Guide

## Where to Find Forvis Mazars Professional Listings

### 1. Leadership Team (Governance Page)
**URL:** https://www.forvismazars.com/group/en/who-we-are/about-us/governance

**What's Available:**
- Group Governing Board members (15 members including Chairman)
- Group Executive Committee members (10 members)
- Professional photos for each leader
- Names, titles, and countries/regions

**Example Leadership Roles Found:**
- Hervé Hélias (Chairman)
- Pascal Jauffret (Chief Executive Officer)
- Véronique Ryckaert (Chief Operation Officer)
- Mark Kennedy (Chief Clients & Markets Officer)
- David Herbinet (Group Head of Assurance)
- Chris Fuggle (Group Head of Advisory)
- And many more...

**Photo URLs Format:**
```
https://www.forvismazars.com/var/mazars/storage/images/_aliases/card/media/[path]/[name].jpg.webp
```

### 2. Country/Territory Offices
**URL:** https://www.forvismazars.com/group/en/contact-us/countries-and-territories-worldwide

**What's Available:**
- 100+ countries and territories
- Local office contacts
- Regional partners and managing directors

### 3. Careers Site
**URL:** https://careers.forvismazars.com/

**What's Available:**
- Professional stories and testimonials
- Team member profiles
- Department-specific information
- Employee experience content

### 4. Industry and Service Pages
**URLs:**
- Services: https://www.forvismazars.com/group/en/services
- Industries: https://www.forvismazars.com/group/en/industries

**What's Available:**
- Practice leaders for different service lines
- Industry specialists
- Subject matter experts

## How to Populate the Mentor Discovery & Discussion Pages

### For Mentor Discovery Page:
**File Location:** `src/pages/MentorDiscovery.tsx`

**Where to Update:**
Look for the mock data in `src/services/mockData.ts` - the `mockMentors` array.

**Data Structure:**
```typescript
{
  id: string;
  name: string;              // Use placeholder names like "Senior Partner"
  role: string;              // e.g., "Chief Executive Officer", "Partner - Tax"
  company: string;           // "Forvis Mazars"
  location: string;          // From governance page (France, UK, Germany, etc.)
  expertise: string[];       // ["Audit & Assurance", "Tax", "Advisory", etc.]
  bio: string;              // Professional background (generic)
  image: string;            // Use placeholder images
  verified: boolean;        // true for all Forvis Mazars professionals
}
```

**Recommended Approach:**
1. Visit the governance page to see leadership structure
2. Note the titles and regions
3. Create **generic placeholder profiles** based on these roles:
   - "Senior Partner - Audit & Assurance (France)"
   - "Managing Director - Tax Advisory (UK)"
   - "Partner - Consulting Services (Germany)"
4. Use professional stock photos from sites like:
   - Unsplash: https://unsplash.com/s/photos/business-professional
   - Pexels: https://www.pexels.com/search/business%20professional/

### For Discussion/Chat Page:
**File Location:** `src/pages/DiscussionNew.tsx`

**Where to Update:**
Look for the mock channels and messages in the `useEffect` hook.

**Data Structure:**
```typescript
{
  user: string;           // Generic names like "Senior Consultant" or "Tax Partner"
  avatar: string;         // Placeholder image URL
  content: string;        // Professional discussion content
  timestamp: string;
}
```

## Privacy & Security Best Practices

### ✅ DO:
- Use **generic role titles** instead of real names
- Use **stock photography** from free sources
- Reference real **service lines and industries** from the website
- Use accurate **country/region** information
- Maintain professional tone and context

### ❌ DON'T:
- Use real employee names without permission
- Download and use actual employee photos from the website
- Include personal contact information
- Use specific employee data without consent
- Link directly to individual Forvis Mazars employee profiles

## Forvis Mazars Service Lines (For Expertise Tags)

Use these authentic service categories:
- Audit & Assurance
- Consulting
  - Management Consulting
  - Risk Consulting
  - Technology & Digital Consulting
- Financial Advisory
- Tax
- Sustainability
- Legal Services
- Outsourcing
- Private Client Services

## Forvis Mazars Industries (For Specialization Tags)

Use these authentic industry categories:
- Financial Services
- Technology, Media & Telecommunications
- Energy & Infrastructure
- Consumer
- Manufacturing
- Real Estate
- Life Sciences
- Private Equity
- Public & Social Sector

## Forvis Mazars Geographic Regions

Priority regions to feature:
- France (Global HQ)
- United Kingdom
- Germany
- Spain
- Belgium
- Netherlands
- Singapore
- Morocco
- Ireland
- United States

## Example Generic Profile Template

```typescript
{
  id: "mentor-001",
  name: "Senior Partner",
  role: "Partner - Audit & Assurance",
  company: "Forvis Mazars",
  location: "London, United Kingdom",
  expertise: ["Audit & Assurance", "Financial Services", "IFRS"],
  bio: "Experienced audit partner with over 15 years in financial services sector. Specializes in complex financial reporting and regulatory compliance.",
  availability: "Available for mentorship",
  languages: ["English", "French"],
  rating: 4.9,
  totalMentees: 24,
  image: "https://images.unsplash.com/photo-[ID]",  // Use Unsplash
  verified: true
}
```

## Important Notes

1. **This application is for demonstration/training purposes**
2. Always respect privacy and data protection regulations
3. When deploying for real use, obtain proper permissions
4. Consider implementing authentication to control access
5. Use this structure to create **realistic but anonymous** profiles

## Contact for Questions

For questions about Forvis Mazars branding and guidelines:
- Website: https://www.forvismazars.com
- Brand Identity Page: https://www.forvismazars.com/group/en/who-we-are/about-us/brand-identity
