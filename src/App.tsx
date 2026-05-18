/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Entries from './pages/Entries';
import Gratitude from './pages/Gratitude';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/entries" element={<Entries />} />
        <Route path="/gratitude" element={<Gratitude />} />
      </Routes>
    </Router>
  );
}

