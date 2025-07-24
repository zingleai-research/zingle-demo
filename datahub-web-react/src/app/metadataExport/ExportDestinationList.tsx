import { Pagination, SearchBar, SimpleSelect } from '@components';
import { InputRef } from 'antd';
import React, { useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import { Message } from '@app/shared/Message';
import usePagination from '@app/sharedV2/pagination/usePagination';

const RefreshButton = (props: any) => <button {...props}>Refresh</button>;

const SourceContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
`;

const HeaderContainer = styled.div`
    flex-shrink: 0;
`;

const StyledTabToolbar = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1px 0 16px 0;
    height: auto;
    z-index: unset;
    box-shadow: none;
    flex-shrink: 0;
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FilterButtonsContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const StyledSearchBar = styled(SearchBar)`
    width: 400px;
`;

const StyledSimpleSelect = styled(SimpleSelect)`
    display: flex;
    align-self: start;
`;

const TableContainer = styled.div`
    flex: 1;
    overflow: auto;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-shrink: 0;
`;

export enum ExportDestinationType {
    ALL,
    ACTIVE,
    INACTIVE,
}

const DEFAULT_PAGE_SIZE = 25;

interface Props {
    showCreateModal: boolean;
    setShowCreateModal: (show: boolean) => void;
    destinations: any[];
    setDestinations: (destinations: any[]) => void;
}

export const ExportDestinationList = ({ showCreateModal, setShowCreateModal, destinations, setDestinations }: Props) => {
    const [query, setQuery] = useState<undefined | string>(undefined);
    const [searchInput, setSearchInput] = useState('');
    const searchInputRef = useRef<InputRef>(null);
    const [destinationFilter, setDestinationFilter] = useState(ExportDestinationType.ALL);

    const { page, setPage, start, count: pageSize } = usePagination(DEFAULT_PAGE_SIZE);

    // Use the destinations passed from parent component
    const destinationsList = destinations;

    // Debounce the search query
    useDebounce(
        () => {
            setPage(1);
            setQuery(searchInput);
        },
        300,
        [searchInput],
    );

    // When destination filter changes, reset page to 1
    React.useEffect(() => {
        setPage(1);
    }, [destinationFilter, setPage]);

    const filteredDestinations = destinationsList.filter((destination) => {
        const matchesQuery = !query || 
            destination.name.toLowerCase().includes(query.toLowerCase()) ||
            destination.type.toLowerCase().includes(query.toLowerCase());
        
        const matchesFilter = destinationFilter === ExportDestinationType.ALL ||
            (destinationFilter === ExportDestinationType.ACTIVE && destination.status === 'ACTIVE') ||
            (destinationFilter === ExportDestinationType.INACTIVE && destination.status === 'INACTIVE');
        
        return matchesQuery && matchesFilter;
    });

    const totalDestinations = filteredDestinations.length;
    const paginatedDestinations = filteredDestinations.slice(start, start + pageSize);

    const onChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
    };

    const handleEditDestination = (urn: string) => {
        console.log('Edit destination:', urn);
        // TODO: Implement edit functionality
    };

    const handleDeleteDestination = (urn: string) => {
        setDestinations(prev => prev.filter(dest => dest.urn !== urn));
    };

    return (
        <>
            <SourceContainer>
                <HeaderContainer>
                    <StyledTabToolbar>
                        <SearchContainer>
                            <StyledSearchBar
                                placeholder="Search..."
                                value={searchInput || ''}
                                onChange={(value) => handleSearchInputChange(value)}
                                ref={searchInputRef}
                            />
                            <StyledSimpleSelect
                                options={[
                                    { label: 'All', value: '0' },
                                    { label: 'Active', value: '1' },
                                    { label: 'Inactive', value: '2' },
                                ]}
                                values={[destinationFilter.toString()]}
                                onUpdate={(values) => setDestinationFilter(Number(values[0]))}
                                showClear={false}
                                width="fit-content"
                                size="lg"
                            />
                        </SearchContainer>
                        <FilterButtonsContainer>
                            <RefreshButton onClick={() => {}} />
                        </FilterButtonsContainer>
                    </StyledTabToolbar>
                </HeaderContainer>
                {totalDestinations === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        {query ? 'No export destinations found matching your search.' : 'No export destinations configured yet. Click "Create new destination" to get started.'}
                    </div>
                ) : (
                    <>
                        <TableContainer>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Name</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Type</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Last Run</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Schedule</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDestinations.map((destination) => (
                                        <tr key={destination.urn} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '12px' }}>{destination.name}</td>
                                            <td style={{ padding: '12px' }}>{destination.type}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: destination.status === 'ACTIVE' ? '#f6ffed' : '#fff2e8',
                                                    color: destination.status === 'ACTIVE' ? '#52c41a' : '#fa8c16'
                                                }}>
                                                    {destination.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {new Date(destination.lastRun).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px' }}>{destination.schedule}</td>
                                            <td style={{ padding: '12px' }}>
                                                <button 
                                                    style={{ marginRight: '8px', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', background: 'white', cursor: 'pointer' }}
                                                    onClick={() => handleEditDestination(destination.urn)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', background: 'white', cursor: 'pointer' }}
                                                    onClick={() => handleDeleteDestination(destination.urn)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableContainer>
                        <PaginationContainer>
                            <Pagination
                                currentPage={page}
                                itemsPerPage={pageSize}
                                total={totalDestinations}
                                showLessItems
                                onPageChange={onChangePage}
                                showSizeChanger={false}
                                hideOnSinglePage
                            />
                        </PaginationContainer>
                    </>
                )}
            </SourceContainer>
        </>
    );
}; 