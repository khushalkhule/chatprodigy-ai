import React from 'react';
import { cn } from '@/lib/utils';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  imageUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Testimonial = ({ quote, author, role, company, imageUrl, className, style }: TestimonialProps) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-2xl p-8 shadow-sm border border-border',
        'transition-all duration-300 hover:shadow-md',
        className
      )}
      style={style}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/20">
            <path d="M13.5 0C8.775 0 5.0625 1.6875 2.3625 5.0625C0.7875 7.425 0 10.35 0 13.5C0 19.575 3.825 24.075 9.9 24.975C9.675 27.225 8.775 29.25 7.425 30.825C5.85 32.4 3.9375 33.75 1.8 34.425C1.35 34.65 1.125 35.1 1.35 35.55C1.575 36 2.025 36.225 2.475 36C4.95 35.1 7.2 33.525 9 31.5C10.8 29.25 12.15 26.55 12.6 23.625C12.825 23.625 13.05 23.625 13.275 23.625C13.3875 23.625 13.5 23.625 13.5 23.625C20.925 23.625 27 18.9 27 13.5C27 5.625 20.925 0 13.5 0ZM40.5 0C35.775 0 32.0625 1.6875 29.3625 5.0625C27.7875 7.425 27 10.35 27 13.5C27 19.575 30.825 24.075 36.9 24.975C36.675 27.225 35.775 29.25 34.425 30.825C32.85 32.4 30.9375 33.75 28.8 34.425C28.35 34.65 28.125 35.1 28.35 35.55C28.575 36 29.025 36.225 29.475 36C31.95 35.1 34.2 33.525 36 31.5C37.8 29.25 39.15 26.55 39.6 23.625C39.825 23.625 40.05 23.625 40.275 23.625C40.3875 23.625 40.5 23.625 40.5 23.625C47.925 23.625 54 18.9 54 13.5C54 5.625 47.925 0 40.5 0Z" fill="currentColor"/>
          </svg>
        </div>

        <p className="text-foreground mb-8 flex-grow">"{quote}"</p>

        <div className="flex items-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={author} 
              className="w-12 h-12 rounded-full object-cover mr-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${author.split(' ').join('+')}&background=random`;
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
              <span className="text-lg font-medium text-primary">
                {author.split(' ').map(name => name[0]).join('')}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}, {company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "We implemented AiReplyr on our e-commerce site and saw a 40% reduction in support tickets while increasing sales conversions by 18%. The ROI has been incredible.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "StyleHub"
    },
    {
      quote: "Setting up our knowledge base was surprisingly easy. The AI accurately answers complex questions about our software, and the lead generation has become our top source of qualified prospects.",
      author: "Michael Chen",
      role: "CTO",
      company: "CloudSync"
    },
    {
      quote: "Our customers love having 24/7 support. The chatbot handles routine questions flawlessly, allowing our team to focus on complex issues. Implementation took just one afternoon.",
      author: "Priya Patel",
      role: "Customer Success Manager",
      company: "FinanceFlow"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of businesses that have transformed their customer experience with AiReplyr.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 grayscale opacity-70">
            <img src="https://placehold.co/120x40?text=Company+Logo" alt="Company Logo" className="h-8" />
            <img src="https://placehold.co/120x40?text=Company+Logo" alt="Company Logo" className="h-8" />
            <img src="https://placehold.co/120x40?text=Company+Logo" alt="Company Logo" className="h-8" />
            <img src="https://placehold.co/120x40?text=Company+Logo" alt="Company Logo" className="h-8" />
            <img src="https://placehold.co/120x40?text=Company+Logo" alt="Company Logo" className="h-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
