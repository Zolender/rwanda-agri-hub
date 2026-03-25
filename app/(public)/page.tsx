import Link from 'next/link';
import { auth } from '../lib/auth';
import { Package, TrendingUp, Shield, Zap, BarChart3, FileUp, CheckCircle2, ArrowRight } from 'lucide-react';
import AnimatedLanding from '../(app)/components/AnimatedLanding';

export default async function HomePage() {
    const session = await auth();
    
    return (
        <AnimatedLanding session={session} />
    );
}